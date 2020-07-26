<template>
    <v-main app class="indigo lighten-5" >

        <bili-video></bili-video>
        <v-container id="chat-container" fluid>
            <!--<div class="chat-wrap">-->
            <div class="chat" id="chat" >
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
    mounted () {
    },
    computed : {
      aliveSession() {
        return this.$store.state.chat.alive;
      },
      aliveUnread() {
        let alive = this.$store.getters.aliveChat;
        return alive ? alive.unread : 0;
      },
      isLogin() {
        return this.$store.getters.isUserLogin;
      },
    },
    watch : {
      aliveUnread(newVal) {
        if (newVal > 0) {
          this.rollToTheBottom();
        }
      },
      // 初始化后的逻辑.
      aliveSession(newVal, oldVal) {
        if (oldVal === newVal) {
          return;
        }
        let $this = this;
        let name = $this.$route.name;

        if (name === 'chat' && newVal === $this.$route.params.session) {
          return;
        }

        if (name === 'chatIndex' || name === 'chat') {
          $this.$router.push({name:'chat', params:{session:newVal}});
        }
      },
      // 监听路由.
      $route (to) {
        let name = to.name;
        // 处理 chat
        if (name !== 'chat') {
          return;
        }

        // chat 页.
        let $this = this;

        let session = to.params.session;
        let chatData = $this.$store.state.chat;

        // 就是当前会话.
        if (session === chatData.alive) {
          $this.refreshConnected();
          $this.rollToTheBottom();
          return;
        }

        let chat = chatData.connected[session];
        if (chat) {
          $this.$store.commit(CHAT_SET_ALIVE, session);
          $this.refreshConnected();
          $this.rollToTheBottom();
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
      }
    },
    methods : {
      refreshConnected() {
        let $this = this;
        $this.connected = Object.values($this.$store.state.chat.connected);
      },
      rollToTheBottom(option = null) {
        let $this = this;
        // 做一个判断逻辑.
        let target = document.body.offsetHeight;

        $this.$store.commit(CHAT_RESET_UNREAD, $this.$store.state.chat.alive);
        $this.$vuetify.goTo(target, option);
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