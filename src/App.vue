<template>
  <v-app>
    <!-- app bar -->
    <AppBar/>

    <!-- drawer -->
    <Drawer v-if="login" />

    <!-- loading -->
    <v-overlay :value="loading" opacity="0.1">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <chat-page v-if="login"></chat-page>
  </v-app>
</template>

<script>

import AppBar from './components/AppBar';
import Drawer from './components/Drawer';
import ChatPage from './components/ChatPage';
import {CHAT_BOTTOM, CHAT_TO_BOTTOM} from "./constants";


export default {
  name: 'App',

  components: {
      Drawer,
      AppBar,
      ChatPage,
  },
  data : () => ({
    login: true,

  }),
  computed:{
    loading () {
      return this.$store.state.layout.loading;
    },
    toBottom() {
      return this.$store.state.layout.chatToBottom;
    },

  },
  watch : {
    toBottom(newVal) {
      //todo 要考虑品是否在底部.
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
