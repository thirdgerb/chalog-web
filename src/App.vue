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

    <v-main>
        <v-container class="chat-container" fluid>
            <div class="chat-wrap">
                <chat-list
                    v-for="chat in chats"
                    :chat="chat"
                    :key="chat.sessionId"
                    v-show="chat.sessionId === alive"
                ></chat-list>
            </div>
            <bili></bili>
            <!--- input --->
            <div class="chat-input">
              <textarea placeholder="请输入..."
                        rows="2"
              ></textarea>
            </div>
        </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar';
import Drawer from './components/Drawer';
import ChatList from './components/ChatList';
import Bili from './components/BiliVideo';


export default {
  name: 'App',

  components: {
      ChatList,
      Drawer,
      AppBar,
      Bili
  },

  data: () => ({
    login : true
    //
  }),
  computed:{

      loading () {
        return this.$store.state.layout.loading;
      },
      chats () {
        return this.$store.state.chats;
      },
      alive() {
        return this.$store.state.layout.alive;
      }
  }
};
</script>

<style>
@import "./assets/chat.css";

body {
  background-color: #eee;
}
</style>
