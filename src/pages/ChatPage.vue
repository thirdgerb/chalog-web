<template>
    <v-main app class="indigo lighten-5" v-scroll="onScroll">
        <Drawer :alive="aliveSession"/>
        <bili-video></bili-video>
        <v-container id="chat-container" fluid >
            <v-overlay :value="querying" opacity="0.05">
                <v-row justify="center" align="center">
                    <v-progress-circular indeterminate color="green"></v-progress-circular>
                </v-row>
            </v-overlay>
            <div class="chat" ref="chat">
                <chat-list
                    v-for="chat in connected"
                    v-show="chat.session === aliveSession"
                    :key="chat.session"
                    :chat="chat"
                    :count="chat.count"
                    v-on:deliver-message="deliverMessage"
                >
                </chat-list>
            </div>
        </v-container>

        <chat-input
            v-if="aliveChat"
            v-on:deliver-message="deliverMessage"
            :alive="aliveChat"
        ></chat-input>
    </v-main>
</template>

<script>
  import ChatList from '../components/ChatList';
  import BiliVideo from '../components/BiliVideo';
  import ChatInput from '../components/ChatInput';
  import {
    CHAT_ACTION_CONNECT_INCOMING,
    CHAT_COMMIT_MESSAGE,
    CHAT_RESET_UNREAD,
    EMITTER_ACTION_DELIVER_MESSAGE, EMITTER_ACTION_QUERY_MESSAGES,
  } from '../constants';


  import Drawer from '../components/Drawer';
  import Logger from 'js-logger';
  import {MessageBatch} from "../socketio/MessageBatch";
  import {Message} from "../socketio/Message";
  import {intendTo} from "../utils";


  export default {
    name: "ChatPage",
    components : {
      BiliVideo,
      ChatList,
      ChatInput,
      Drawer
    },
    // prop from router
    props : ['aliveSession'],
    data: () => ({
      // 滚动中禁止循环滚动
      scrolling : false,
      isAtBottom: false,
      scrollTop: -10,
      connected : [],
      aliveChat : null,
      querying : false,
    }),
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.onRoute(to)
      });
    },
    // 组件跳转.
    beforeRouteUpdate(to, from, next) {
      let $this= this;
      $this.onRoute(to);
      next();
    },
    computed : {
      unread() {
        let $this = this;
        return $this.$store.state.chat.unread;
      },
    },
    watch : {
      unread(newVal, oldVal) {
        let $this = this;
        if (newVal > oldVal && $this.aliveSession === $this.$store.state.chat.updated) {
          this.rollToTheBottom($this.aliveSession, false);
        }
      },
    },
    methods : {
      onRoute(route) {

        if (route.name !== 'chat') {
          return ;
        }

        let $this = this;
        if (!$this.$store.getters.isUserLogin) {
          intendTo($this, {name:'index'});
          return;
        }

        let session = route.params.session;


        let chat = $this.$store.state.chat.connected[session];
        if (chat) {
          $this.setAlive(chat);
          return;
        }

        chat = $this.$store.state.chat.incoming[session];

        if (!chat) {
          Logger.error('route path ' + session + ' not exists');
          // 无法识别的路由.
          $this.$store.state.next = null;
          $this.$router.push('/404');
          return;
        }

        $this.$store.dispatch(CHAT_ACTION_CONNECT_INCOMING, session);
        $this.setAlive(chat);
      },
      setAlive(chat) {
        let $this = this;
        $this.aliveChat = chat;
        $this.refreshConnected();
        $this.rollToTheBottom(chat.session, true);
      },
      /**
       * 监控滚动.
       */
      onScroll() {
        let $this = this;
        if ($this.scrolling) {
          return;
        }
        let prev = $this.scrollTop;

        let el = document.documentElement;
        let top = $this.scrollTop = el.scrollTop;
        $this.isAtBottom = (el.scrollTop + el.clientHeight + 15) >= el.scrollHeight;

        if (top === 0 && top < prev ) {
          $this.queryElderMessages();
        }
      },
      /**
       * 尝试查询较老的信息.
       */
      queryElderMessages() {
        let $this = this;
        if ($this.querying) {
          return;
        }

        let aliveChat = $this.aliveChat;
        if (!aliveChat) {
          return;
        }

        if (!aliveChat.hasElderMessages) {
          return;
        }

        $this.querying = true;
        setTimeout(function() {
          $this.querying = false;
        }, 500);

        $this.$store.dispatch(
          EMITTER_ACTION_QUERY_MESSAGES,
          {session:aliveChat.session, forward:false, limit:5}
        );

      },
      /**
       * 刷新连接对象, 从而刷新列表.
       */
      refreshConnected() {
        let $this = this;
        let connected = $this.$store.state.chat.connected;
        $this.connected = Object.values(connected);
      },
      /**
       * 滚动到底部.
       */
      rollToTheBottom(session, force) {

        let $this = this;
        if (!force && !$this.isAtBottom && !$this.scrolling) {
          return;
        }

        $this.$store.commit(CHAT_RESET_UNREAD, session);

        if ($this.scrolling) {
          return;
        }

        $this.scrolling = true;
        setTimeout(function() {
          // 做一个判断逻辑.
          let target = document.documentElement.offsetHeight - 5;
          $this.$vuetify.goTo(target);
          $this.scrolling = false;
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
        let session = $this.aliveSession;
        let chat = $this.$store.state.chat.connected[session];

        if (!chat) {
          Logger.error('alive chat ' + session + ' not exists');
          return;
        }

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

        $this.$store.dispatch(
          EMITTER_ACTION_DELIVER_MESSAGE,
          {message, session, query: $this.$route.query}
        );

        $this.rollToTheBottom(session, true);
        $this.refreshConnected();
      },

    },
  }
</script>

<style scoped>
@import "../assets/chat.css";
</style>