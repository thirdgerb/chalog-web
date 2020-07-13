<template>
  <v-app>
    <!-- app bar -->
    <AppBar/>

    <!-- drawer -->
    <Drawer/>

    <!-- loading -->
    <v-overlay :value="loading" opacity="0.1">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <bili></bili>

    <v-main app  class="indigo lighten-5">
        <v-container id="chat-container" fluid>
            <!--<div class="chat-wrap">-->
            <div class="chat" id="chat">
                <chat-list :chat="alive"></chat-list>
                <div id="chat-bottom"></div>
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
            <chat-input></chat-input>
        </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar';
import Drawer from './components/Drawer';
import ChatList from './components/ChatList';
import Bili from './components/BiliVideo';
import ChatInput from './components/ChatInput';
import {CHAT_BOTTOM, CHAT_TO_BOTTOM} from "./constants";


export default {
  name: 'App',

  components: {
    ChatInput,
      ChatList,
      Drawer,
      AppBar,
      Bili
  },
  data: () => ({
    login : true,
    isChatAtBottom : true,
  }),
  computed:{

      loading () {
        return this.$store.state.layout.loading;
      },
      alive() {
        return this.$store.state.alive;
      },
      toBottom() {
        return this.$store.state.layout.chatToBottom;
      },
  },
  watch : {
    toBottom(newVal) {
      if (newVal === true) {
        this.toTheEnd();
      }
    }

  },
  methods : {
    toTheEnd() {
      this.$vuetify.goTo(CHAT_BOTTOM);
      this.$store.commit({
        type: CHAT_TO_BOTTOM,
        value: false
      })
    }
  },

};
</script>

<style>
@import "./assets/chat.css";

</style>
