<template>
    <v-main app class="indigo lighten-5">
        <bili></bili>
        <v-container id="chat-container" fluid>
            <!--<div class="chat-wrap">-->
            <div class="chat" id="chat">
                <chat-list
                    v-for="chat in chats"
                    v-show="chat.session === alive"
                    :key="chat.session"
                    :chat="chat"
                >
                </chat-list>
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
</template>

<script>
  import ChatList from './ChatList';
  import Bili from './BiliVideo';
  import ChatInput from './ChatInput';

  export default {
    name: "ChatPage",
    components : {
      Bili,
      ChatList,
      ChatInput,
    },
    computed : {
      alive() {
        return this.$store.state.menu.alive.session;
      },
      chats() {
        return this.$store.state.chats;
      }

    },

  }
</script>

<style scoped>

</style>