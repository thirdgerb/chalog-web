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
        Demo
    </v-toolbar>
    <v-divider></v-divider>
    <!-- alive chat -->
    <v-subheader>当前</v-subheader>
    <v-list dense nav v-if="alive">
      <v-list-item-group transition="scroll-y-transition">
        <menu-item
          :item="alive"
          :isAlive="true"
          @close-chat="onDisconnect(alive)"
        ></menu-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>

    <!-- subscribe chats -->
    <v-subheader>已连接</v-subheader>
    <v-list dense nav>
      <v-list-item-group transition="scroll-y-transition">
        <menu-item
           v-for="item in connected"
           :item="item"
           :key="item.session"
           v-on:close-chat="onDisconnect(item)"
           v-on:select-chat="onSelect(item)"
        ></menu-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <v-subheader>未连接</v-subheader>
    <v-list dense nav>
      <v-list-item-group transition="scroll-y-transition">
        <menu-item v-for="item in list"
           :item="item"
           :key="item.session"
           v-on:close-chat="onClose(item)"
           v-on:select-chat="onConnect(item)"
        ></menu-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>


</template>

<script>
  import MenuItem from './MenuItem';
  import {
    DRAWER_SETTER,
    CHAT_DELETE,
    CHAT_ALIVE_SETTER,
  } from "../constants";
  import Request from "../socketio/Request";
  import Room from '../socketio/Room';

  export default {
      name: "Drawer",
      components : {
        MenuItem: MenuItem
      },
        mounted() {
            console.log('drawer mounted');
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
        },
        /**
         * 删除会话.
         * @param {NavItem} item
         */
        onClose(item) {
          if (confirm('关闭当前对话?')) {
            this.$store.commit(
              CHAT_DELETE,
              item
            );
          }
        },
        /**
         * 退出房间, 删除会话.
         * @param {NavItem} item
         */
        onDisconnect(item) {
          let $this = this;
          let proto = new Room({
            session: item.session,
            scene: item.scene,
          });

          // 退出房价.
          $this.$socket.emit('LEAVE', new Request({
            token: $this.$store.getters.token,
            proto,
          }));

          // 删除会话.
          $this.onClose(item);
        },
        onConnect(item) {
          let $this = this;
          let proto = new Room({
            session: item.session,
            scene: item.scene,
          });

          $this.onSelect(item);

          // 进入房间.
          $this.$socket.emit('JOIN', new Request({
            token: $this.$store.getters.token,
            proto,
          }));

        },

      },

  }
</script>

<style scoped>

</style>