<template>
    <v-main app class="indigo lighten-5" >

        <!-- drawer -->
        <Drawer />

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
  import Drawer from '../components/Drawer';
  import {CHAT_SET_ALIVE, CHAT_COMMIT_MESSAGE} from "../store/chat";
  import Room from '../socketio/Room';
  import Logger from 'js-logger';

  import Input from "../socketio/Input";
  import Request from "../socketio/Request";
  import {MessageBatch} from "../socketio/MessageBatch";
  import {Message} from "../socketio/Message";
  import {getResponse} from "../utils";


  export default {
    name: "ChatPage",
    components : {
      BiliVideo,
      ChatList,
      ChatInput,
      Drawer,
    },
    data: () => ({
      // 滚动中禁止循环滚动
      scrolling : false,
      connected : [],
    }),
    mounted () {
      let $this =this;
      // 如果没有登录, 则跳转到首页.
      if (!$this.$store.getters.isUserLogin) {
        $this.$router.replace({name:'index'});
        return;
      }

      // 检查路由的页面是否存在.
      let chat = $this.$store.state.chat;
      let session = $this.$route.params.session;
      let selected = chat.connected[session] || chat.incoming[session];

      if (selected) {
        $this.$store.commit(CHAT_SET_ALIVE, session);
        $this.joinAll();
      } else {
        $this.$router.push('/404');
      }
    },
    sockets : {
      reconnect() {
        this.joinAll();
      },
      MESSAGE_BATCH (res) {
        let $this = this;
        getResponse(res, function(proto) {
          let batch = new MessageBatch(proto);
          $this.$store.commit(
            CHAT_COMMIT_MESSAGE,
            batch
          );
          $this.refreshConnected();
        });
      }
    },
    computed : {
      aliveSession() {
        return this.$store.state.chat.alive;
      },
      isLogin() {
        return this.$store.getters.isUserLogin;
      },
    },
    watch : {
      // 监听路由.
      $route (to) {
        let name = to.name;

        // 处理 chat
        if (name !== 'chat') {
          return;
        }
        let $this = this;
        let session = to.params.session;
        let chatData = $this.$store.state.chat;

        // 就是当前会话.
        if (session === chatData.alive) {
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
          $this.join(chat);
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
        setTimeout(function() {
          let target = document.body.offsetHeight;
          $this.$vuetify.goTo(target, option);
        }, 100);
      },
      join(chat) {
        let room = new Room(chat);
        let $this = this;
        let token = $this.$store.state.user.token;
        let request = new Request({proto:room, token:token});
        $this.$socket.emit('JOIN', request);
        Logger.info("join room " + room.scene + ' ' + room.session);
      },
      joinAll() {
        let $this = this;
        $this.refreshConnected();
        for(let c of $this.connected) {
          $this.join(c);
        }
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

        let input = new Input(
          {session , bot : chat.bot, scene: chat.scene},
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
      // toTheEnd() {
      //   let $this = this;
      //   $this.$store.commit(CHAT_TO_BOTTOM, 0);
      //   if ($this.scrolling) {
      //     return;
      //   }
      //
      //   $this.scrolling = true;
      //   setTimeout(function(){
      //     $this.$vuetify.goTo(document.body.offsetHeight);
      //     $this.scrolling = false;
      //   }, 200);
      // },
    },
  }
</script>

<style scoped>
@import "../assets/chat.css";
</style>