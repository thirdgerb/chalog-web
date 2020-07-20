<template>
    <v-main app class="indigo lighten-5" >

        <!-- drawer -->
        <Drawer v-if="isLogin"/>

        <bili></bili>
        <v-container id="chat-container" fluid>
            <!--<div class="chat-wrap">-->
            <div class="chat" id="chat" >
                <chat-list
                    v-for="(chat,session) in chats"
                    :key="session"
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
  import Message from "../protocals/Message";
  import Input from "../socketio/Input";
  import Request from "../socketio/Request";
  import {MessageBatch} from "../protocals/MessageBatch";


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
      // let $this =this;
      // if (!$this.$store.getters.isLogin) {
      //   $this.$router.replace({name:'index'});
      // }
      console.log('chat page mounted');
    },
    computed : {
      aliveSession() {
        return this.$store.state.menu.alive.session;
      },
      chats() {
        return this.$store.state.chats;
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

        if (!(message instanceof Message)) {
          throw new Error('message should be instance of Message');
        }

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
        console.log(request);
        // 向服务端投递消息.
        // $this.$socket.emit('INPUT', request);

        // 提交消息到当前列表.
        let batch = MessageBatch.createByMessage(message, $this.$store.state.user);

        $this.$store.commit(
          CHAT_COMMIT_MESSAGE,
          {session:alive.session, batch}
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