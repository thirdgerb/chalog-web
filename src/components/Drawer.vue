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
      Commune v0.2
    </v-toolbar>
    <v-divider></v-divider>
    <!-- alive chat -->
    <v-subheader>当前会话</v-subheader>
    <v-list dense nav>
      <v-list-item-group >
        <chat-item
          :item="alive"
          :seletable="false"
        ></chat-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>

    <!-- subscribe chats -->
    <v-subheader>Connected</v-subheader>
    <v-list dense nav>
      <v-list-item-group >
        <template v-for="chat in chats">
            <chat-item
               :item="chat"
               :key="chat.sessionId" ></chat-item>
        </template>
      </v-list-item-group>
    </v-list>
    <template v-if="incoming.length > 0">
        <v-subheader>Incoming</v-subheader>
        <v-list dense nav>
          <v-list-item-group >
            <chat-item v-for="item in incoming"
               :item="item"
               :key="item.sessionId" ></chat-item>
          </v-list-item-group>
        </v-list>
    </template>
  </v-navigation-drawer>


</template>

<script>
  import ChatItem from './ChatItem';
  import {DRAWER_SETTER} from "../constants";

  export default {
      name: "Drawer",
      components : {
        ChatItem
      },
      computed : {
        drawer : {
          get () {
            return this.$store.state.layout.drawer;
          },
          set (val) {
            this.$store.commit(DRAWER_SETTER, val);
          }
        },
        chats () {
          return this.$store.state.chats;
        },
        alive () {
          return this.$store.state.alive;
        },
        incoming() {
          return this.$store.state.incomingChats;
        }
      }
  }
</script>

<style scoped>

</style>