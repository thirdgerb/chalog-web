<template>
    <v-main app class="indigo lighten-5" >

        <!-- drawer -->
        <Drawer v-if="isLogin"/>

        <bili></bili>
        <v-container id="chat-container" fluid v-if="isLogin">
            <!--<div class="chat-wrap">-->
            <div class="chat" id="chat" >
                <chat-list
                    v-for="chat in chats"
                    v-show="chat.session === alive"
                    :key="chat.session"
                    :chat="chat"
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
            <chat-input></chat-input>
        </v-footer>
        <div id="chat-bottom"></div>
    </v-main>
</template>

<script>
  import ChatList from '../components/ChatList';
  import Bili from '../components/BiliVideo';
  import ChatInput from '../components/ChatInput';
  import Drawer from '../components/Drawer';
  import NavItem from '../protocals/NavItem';

  import {
    CHAT_TO_BOTTOM,
    CHAT_BOTTOM,
    ACTION_CHAT_CONNECT,
    CHAT_ALIVE_SETTER,
    CHAT_LIST_PUSH,
  } from "../constants";

  import {
    DRAWER_SETTER,
  } from "../constants";

  export default {
    name: "ChatPage",
    components : {
      Bili,
      ChatList,
      ChatInput,
      Drawer,
    },
    created () {
      let $this =this;

      let $route = $this.$route;
      if ($route.name === 'chat') {
        let scene = $route.params.scene;
        let session = $route.params.session;
        $this.onRoute(scene, session);
      }

      // 慢慢地才打开抽屉.
      setTimeout(function() {
        $this.$store.commit(DRAWER_SETTER, null);
      }, 1000);

    },
    beforeRouteUpdate(to) {
      let name = to.name;
      if (name !== 'chat') {
        return;
      }

      if (!this.$store.getters.isLogin) {
        this.$router.push({name:'login'});
      }

      let session = to.params.session;
      let scene = to.params.scene;
      this.onRoute(scene, session);
    },
    mounted() {
      let $this =this;

      // 检查是否已登录.
      if (!$this.$store.getters.isLogin) {
        $this.$router.push({name:'login'});
      }

      // 开始连接.

    },
    computed : {
      alive() {
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
      }

    },

    watch : {
      toBottom(newVal) {
        //todo 要考虑品是否在底部.
        if (newVal === true) {
          this.toTheEnd();
        }
      },

    },
    methods : {
      toTheEnd() {
        this.$vuetify.goTo(CHAT_BOTTOM);
        this.$store.commit({
          type: CHAT_TO_BOTTOM,
          value: false
        })
      },

      onRoute(scene, session) {
        let $this = this;
        let menu = $this.$store.state.menu;

        // 如果正是当前节点.
        if (session === menu.alive.session) {
          return;
        }

        // 如果是未连接.
        let chat = menu.list[session];
        if (chat) {
          $this.$store.dispatch(ACTION_CHAT_CONNECT, chat);
          return;
        }

        // 如果是已连接, 切换.
        chat = menu.connected[session];
        if (chat) {
          $this.$store.commit(CHAT_ALIVE_SETTER, chat);
          return;
        }

        // 都没有, 尝试创建会话.
        let navItem = NavItem.from({
            scene,
            session,
            closable: true
          },
          $this.$store.state.user.id
        );

        $this.$store.commit(CHAT_LIST_PUSH, navItem);
        $this.$store.dispatch(ACTION_CHAT_CONNECT, navItem);
      },
    },
  }
</script>

<style scoped>
@import "../assets/chat.css";
</style>