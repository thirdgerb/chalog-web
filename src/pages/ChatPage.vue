<template>
    <v-main app class="indigo lighten-5" >
        <Drawer :alive="aliveSession"/>
        <bili-video></bili-video>
        <v-container id="chat-container" fluid >
            <!--<div class="chat-wrap">-->
            <div class="chat" ref="chat" v-scroll.self="onScroll">
                <chat-list
                    v-for="chat in connected"
                    v-show="chat.session === aliveSession"
                    :key="chat.session"
                    :chat="chat"
                    :count="chat.count"
                >
                </chat-list>
            </div>
            <!--- input --->
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
    EMITTER_ACTION_DELIVER_MESSAGE,
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
      connected : [],
      aliveChat : null
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
          console.log(newVal, oldVal, $this.aliveSession, $this.$store.state.chat.updated);
          this.rollToTheBottom($this.aliveSession);
        }
      },
    },
    methods : {
      onRoute(route, animation = null) {

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
          $this.setAlive(chat, animation);
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
        $this.setAlive(chat, animation);
      },
      setAlive(chat, animation) {
        let $this = this;
        $this.aliveChat = chat;
        $this.refreshConnected();
        $this.rollToTheBottom(chat.session, animation);
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
        let connected = $this.$store.state.chat.connected;
        $this.connected = Object.values(connected);
      },
      /**
       * 滚动到底部.
       */
      rollToTheBottom(session, option = null) {

        let $this = this;
        $this.$store.commit(CHAT_RESET_UNREAD, session);

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
        let session = $this.aliveSession;
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
        $this.rollToTheBottom(session);
      },
    },
  }
</script>

<style scoped>
@import "../assets/chat.css";
</style>