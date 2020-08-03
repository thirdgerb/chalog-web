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
           v-for="(chat, index) in connected"
           :session="chat.session"
           :connected="true"
           :alive="alive"
           :unread="chat.unread"
           :lastMessage="chat.lastMessage"
           :chat="chat"
           :key="index"
        ></chat-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <v-subheader>未连接</v-subheader>
    <v-list dense nav>
      <v-list-item-group transition="scroll-y-transition">
        <chat-item v-for="(chat, index) in incoming"
           :session="chat.session"
           :connected="false"
           :chat="chat"
           :unread="chat.unread"
           :lastMessage="chat.lastMessage"
           :alive="alive"
           :key="index"
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
      data : () => ({
        connected: [],
        incoming: [],
      }),
      mounted() {
        let $this = this;
        $this.getConnected();
        $this.getIncoming();
      },
      computed : {
        title() {
          return this.$store.state.user.name || process.env.VUE_APP_TITLE;
        },
        commits() {
          return this.$store.state.chat.commit;
        },
        drawer : {
          get () {
            return this.$store.state.layout.drawer;
          },
          set (val) {
            this.$store.commit(LAYOUT_DRAWER_TOGGLE, val);
          }
        },

      },
      watch : {
        commits(newVal, oldVal) {
          if (newVal > oldVal) {
            let $this = this;
            $this.getConnected();
            $this.getIncoming();
          }
        }
      },
      methods : {
        getConnected () {
          let chats = this.$store.state.chat;
          let sessions = chats.connectedSessions;
          if (!sessions) {
            return [];
          }

          this.connected = sessions.map(function(session){
            return chats.connected[session];
          }).filter(function(chat) {
            return !!chat;
          });

        },
        getIncoming () {
          let chats = this.$store.state.chat;
          let sessions = chats.incomingSessions;
          if (!sessions) {
            return [];
          }

          this.incoming = sessions.map(function(session){
            return chats.incoming[session];
          }).filter(function(chat) {
            return !!chat;
          });
        }

      }
  }
</script>

<style scoped>
</style>