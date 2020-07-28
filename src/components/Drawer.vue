<template>
  <!-- navigation -->
  <v-navigation-drawer
      v-model="drawer"
      app
      fixed
  >
    <v-toolbar
     flat
     dense
    >
        {{ title }}
    </v-toolbar>
    <v-divider></v-divider>
    <!-- subscribe chats -->
    <v-list dense nav>
      <v-list-item-group transition="scroll-y-transition" :value="alive">
        <chat-item
           v-for="chat in connected"
           :session="chat.session"
           :connected="true"
           :alive="alive"
           :chat="chat"
           :key="chat.session"
        ></chat-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <v-subheader>未连接</v-subheader>
    <v-list dense nav>
      <v-list-item-group transition="scroll-y-transition">
        <chat-item v-for="chat in incoming"
           :session="chat.session"
           :connected="false"
           :chat="chat"
           :unread="chat.unread"
           :alive="alive"
           :key="chat.session"
        ></chat-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>


</template>

<script>
  import ChatItem from './ChatItem';
  import {LAYOUT_DRAWER_TOGGLE} from "../constants";

  export default {
      name: "Drawer",
      components : {
        ChatItem
      },
      props: ['alive', 'updated'],
      computed : {
        title() {
          return this.$store.state.user.name || process.env.VUE_APP_TITLE;
        },
        drawer : {
          get () {
            return this.$store.state.layout.drawer;
          },
          set (val) {
            this.$store.commit(LAYOUT_DRAWER_TOGGLE, val);
          }
        },
        connected () {
          let chats = this.$store.state.chat;
          let sessions = chats.connectedSessions;
          if (!sessions) {
            return [];
          }

          return sessions.map(function(session){
                return chats.connected[session];
              }).filter(function(chat) {
                return !!chat;
              });
        },
        incoming () {
          let chats = this.$store.state.chat;
          let sessions = chats.incomingSessions;
          if (!sessions) {
            return [];
          }

          return sessions.map(function(session){
            return chats.incoming[session];
          }).filter(function(chat) {
            return !!chat;
          });
        }
      },
  }
</script>

<style scoped>
</style>