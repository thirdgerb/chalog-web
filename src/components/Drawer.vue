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
    <v-subheader>当前</v-subheader>
    <v-list dense nav>
      <v-list-item-group >
        <chat-item
          :item="alive"
          :isAlive="true"
          @close-chat="onDisconnect(alive)"
        ></chat-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>

    <!-- subscribe chats -->
    <v-subheader>已连接</v-subheader>
    <v-list dense nav>
      <v-list-item-group >
        <chat-item
           v-for="item in connected"
           :item="item"
           :key="item.session"
           v-on:close-chat="onDisconnect(item)"
           v-on:select-chat="onSelect(item)"
        ></chat-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <v-subheader>未连接</v-subheader>
    <v-list dense nav>
      <v-list-item-group >
        <chat-item v-for="item in list"
           :item="item"
           :key="item.session"
           v-on:close-chat="onClose(item)"
           v-on:select-chat="onConnect(item)"
        ></chat-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>


</template>

<script>
  import ChatItem from './ChatItem';
  import {
    DRAWER_SETTER,
    // ACTION_CHAT_CONNECT,
    CHAT_ALIVE_SETTER,
    CHAT_DELETE,
    ACTION_CHAT_CONNECT,
  } from "../constants";

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
        connected () {
          return this.$store.state.menu.connected;
        },
        alive () {
          return this.$store.state.menu.alive;
        },
        list () {
          return this.$store.state.menu.list;
        }
      },
      methods : {
        onSelect(item) {
          this.$store.commit(
            CHAT_ALIVE_SETTER,
            item
          );
          this.$forceUpdate();
        },
        onConnect(item) {
          this.$store.dispatch(
            ACTION_CHAT_CONNECT,
            item
          );
          this.$forceUpdate();
        },
        onClose(item) {
          if (confirm('关闭当前对话?')) {
            this.$store.commit(
              CHAT_DELETE,
              item
            );
            this.$forceUpdate();
          }
        },
        onDisconnect(item) {
          if (confirm('关闭当前对话?')) {
            this.$store.commit(
              CHAT_DELETE,
              item
            );
            this.$forceUpdate();
          }
        },
      }
  }
</script>

<style scoped>

</style>