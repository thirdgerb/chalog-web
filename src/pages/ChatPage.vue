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
    </v-main>
</template>

<script>
  import ChatList from '../components/ChatList';
  import Bili from '../components/BiliVideo';
  import ChatInput from '../components/ChatInput';
  import Drawer from '../components/Drawer';

  import {
    CHAT_TO_BOTTOM,
  } from "../constants";


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
        if (newVal > 0) {
          this.toTheEnd();
        }
      },
    },
    methods : {
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