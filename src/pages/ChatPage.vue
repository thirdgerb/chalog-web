<template>
    <v-main app class="indigo lighten-5" >
        <bili-video></bili-video>
        <v-container id="chat-container" fluid >
            <!--<div class="chat-wrap">-->
            <div class="chat" ref="chat" v-scroll.self="onScroll">
                <chat-list
                    v-for="chat in connected"
                    v-show="chat.session === aliveSession"
                    :key="chat.session"
                    :chat="chat"
                >
                </chat-list>
            </div>
            <!--- input --->
        </v-container>
        <v-footer
            v-show="aliveSession"
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
  import BiliVideo from '../components/BiliVideo';
  import ChatInput from '../components/ChatInput';
  import {
    CHAT_SET_ALIVE,
    CHAT_COMMIT_MESSAGE,
    CHAT_RESET_UNREAD, EMITTER_ACTION_DELIVER_MESSAGE
  } from '../constants';

  import Logger from 'js-logger';
  import {MessageBatch} from "../socketio/MessageBatch";
  import {Message} from "../socketio/Message";
  import {EMITTER_ACTION_JOIN} from "../constants";
  import {intendTo} from "../utils";


  export default {
    name: "ChatPage",
    components : {
      BiliVideo,
      ChatList,
      ChatInput,
    },
    data: () => ({
      // 滚动中禁止循环滚动
      scrolling : false,
      connected : [],
    }),
    created() {
      let vm = this;
      if (!vm.$store.getters.isUserLogin) {
        intendTo(vm, {name:'index'});
      } else {
        vm.refreshConnected();
      }
    },
    // 组件跳转.
    beforeRouteUpdate(to, from, next) {
      this.setAlive(to.params.session);
      next();
    },
    computed : {
      aliveSession() {
        return this.$store.state.chat.alive;
      },
      aliveUnread() {
        let alive = this.$store.getters.aliveChat;
        return alive ? alive.unread : 0;
      },
    },
    watch : {
      aliveUnread(newVal) {
        if (newVal > 0) {
          this.rollToTheBottom();
        }
      },
    },
    methods : {
      setAlive(session, animation = null) {
        // chat 页.
        let $this = this;
        let chatData = $this.$store.state.chat;

        // 就是当前会话.
        if (session === chatData.alive) {
          $this.refreshConnected();
          $this.rollToTheBottom(animation);
          return;
        }

        let chat = chatData.connected[session];
        if (chat) {
          $this.$store.commit(CHAT_SET_ALIVE, session);
          $this.refreshConnected();
          $this.rollToTheBottom(animation);
          return;
        }

        chat = chatData.incoming[session];
        if (chat) {
          $this.$store.commit(CHAT_SET_ALIVE, session);
          $this.$store.dispatch(EMITTER_ACTION_JOIN, chat);
          $this.refreshConnected();
          $this.rollToTheBottom();
          return;
        }

        Logger.error('route path ' + session + ' not exists');
        // 无法识别的路由.
        $this.$router.push('/404');
      },
      /**
       * 监控滚动.
       */
      onScroll(e) {
        console.log(e.target.body.scrollTop);
      },
      /**
       * 刷新连接对象, 从而刷新列表.
       */
      refreshConnected() {
        let $this = this;
        $this.connected = Object.values($this.$store.state.chat.connected);
      },
      /**
       * 滚动到底部.
       */
      rollToTheBottom(option = null) {

        let $this = this;
        $this.$store.commit(CHAT_RESET_UNREAD, $this.$store.state.chat.alive);

        setTimeout(function() {
          // 做一个判断逻辑.
          let target = document.body.offsetHeight;
          $this.$vuetify.goTo(target, option);
        }, 200);
      },
      /**
       * @param {Message} message
       */
      deliverMessage(message) {
        if (!(message instanceof Message)) {
          Logger.error('message must be instance of Message');
          return;
        }
        let $this = this;
        // 准备需要发送的消息.
        let session = $this.$store.state.chat.alive;
        let chat = $this.$store.state.chat.connected[session];

        if (!chat) {
          Logger.error('alive chat ' + session + ' not exists');
          return;
        }

        $this.$store.dispatch(EMITTER_ACTION_DELIVER_MESSAGE, {message, session});

        // 提交消息到当前列表.
        let batch = MessageBatch.createByMessage(
          session,
          message,
          $this.$store.state.user
        );

        $this.$store.commit(
          CHAT_COMMIT_MESSAGE,
          batch
        );

        $this.refreshConnected();
        $this.rollToTheBottom();
      },
    },
  }
</script>

<style scoped>
@import "../assets/chat.css";
</style>