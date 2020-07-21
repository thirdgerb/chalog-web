<template>
    <v-main app class="indigo lighten-5" >

        <!-- drawer -->
        <Drawer v-if="isLogin"/>

        <bili></bili>
        <v-container id="chat-container" fluid>
            <!--<div class="chat-wrap">-->
            <div class="chat" id="chat" >
                <chat-list
                    v-for="chat in chats"
                    v-show="chat.session === aliveSession"
                    :key="chat.session"
                    :chat="chat"
                    v-on:deliver-message="deliverMessage"
                >
                </chat-list>
            </div>
            <!--- input --->
        </v-container>
        <v-footer
            v-if="isLogin"
            fixed
            app
            dense
            padless
            inset
        >
            <chat-input
                v-on:deliver-message="deliverMessage"
            ></chat-input>
        </v-footer>
    </v-main>
</template>

<script>
  import ChatList from '../components/ChatList';
  import Bili from '../components/BiliVideo';
  import ChatInput from '../components/ChatInput';
  import Drawer from '../components/Drawer';

  import {
    CHAT_COMMIT_MESSAGE,
    CHAT_TO_BOTTOM,
  } from "../constants";
  import Input from "../socketio/Input";
  import Request from "../socketio/Request";
  import {MessageBatch} from "../protocals/MessageBatch";
  import {getResponse} from "../utils";


  export default {
    name: "ChatPage",
    components : {
      Bili,
      ChatList,
      ChatInput,
      Drawer,
    },
    data: () => ({
      // 滚动中禁止循环滚动
      scrolling : false
    }),
    mounted () {
      let $this =this;
      if (!$this.$store.getters.isLogin) {
        $this.$router.replace({name:'index'});
      }
    },
    sockets : {
      MESSAGE_BATCH(res) {
        let $this = this;
        getResponse(res, function(proto) {
          let batch = new MessageBatch(proto);
          $this.$store.commit(
            CHAT_COMMIT_MESSAGE,
            batch
          );
        });
      },
    },
    computed : {
      aliveSession() {
        return this.$store.state.menu.alive.session;
      },
      chats() {
        return Object.values(this.$store.state.chats);
      },
      toBottom() {
        return this.$store.state.layout.chatToBottom;
      },
      isLogin() {
        return this.$store.getters.isLogin;
      },
    },
    watch : {
      toBottom(newVal) {
        //todo 要考虑品是否在底部.
        if (newVal > 0) {
          this.toTheEnd();
        }
      },
      isLogin(newVal) {
        if (!newVal) {
          this.$router.push({name:'index'});
        }
      },
      chats(val) {
        console.log(val);
      }
    },
    methods : {
      deliverMessage(message) {
        let $this = this;
        // 准备需要发送的消息.
        let alive = $this.$store.state.menu.alive;
        let input = new Input(
          {session: alive.session, bot : alive.bot, scene: alive.scene},
          message
        );

        let request = new Request({
          token: $this.$store.getters.token,
          proto: input
        });

        // 向服务端投递消息.
        $this.$socket.emit('INPUT', request);

        // 提交消息到当前列表.
        let batch = MessageBatch.createByMessage(
          alive.session,
          message,
          $this.$store.state.user
        );

        $this.$store.commit(
          CHAT_COMMIT_MESSAGE,
          batch
        );
      },
      toTheEnd() {
        let $this = this;
        $this.$store.commit(CHAT_TO_BOTTOM, 0);
        if ($this.scrolling) {
          return;
        }

        $this.scrolling = true;
        setTimeout(function(){
          $this.$vuetify.goTo(document.body.offsetHeight);
          $this.scrolling = false;
        }, 200);
      },
    },
  }
</script>

<style scoped>
@import "../assets/chat.css";
</style>