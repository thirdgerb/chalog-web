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
        <menu-item
           v-for="session in connected"
           :session="session"
           :connected="true"
           :key="session"
           v-on:close-chat="closeChat"
        ></menu-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <v-subheader>未连接</v-subheader>
    <v-list dense nav>
      <v-list-item-group transition="scroll-y-transition">
        <menu-item v-for="session in incoming"
           :session="session"
           :connected="false"
           :key="session"
           v-on:close-chat="closeChat"
        ></menu-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>


</template>

<script>
  import MenuItem from './MenuItem';
  import {LAYOUT_DRAWER_TOGGLE} from "../store/layout";
  import {CHAT_DELETE} from "../store/chat";

  export default {
      name: "Drawer",
      components : {
        MenuItem: MenuItem
      },
      computed : {
        title() {
          return process.env.VUE_APP_TITLE;
        },
        drawer : {
          get () {
            return this.$store.state.layout.drawer;
          },
          set (val) {
            this.$store.commit(LAYOUT_DRAWER_TOGGLE, val);
          }
        },
        alive() {
            return this.$store.state.chat.alive;
        },
        connected () {
          return this.$store.state.chat.connectedSessions;
        },
        incoming () {
          return this.$store.state.chat.incomingSessions;
        }
      },
      methods : {
        closeChat(session) {
          let $this = this;
          $this.$store.commit(CHAT_DELETE, session);
          $this.$forceUpdate();
        }

        // onSelect(item) {
        //
        //   this.$store.commit(
        //     CHAT_ALIVE_SETTER,
        //     item
        //   );
        // },
        // /**
        //  * 删除会话.
        //  * @param {NavItem} item
        //  */
        // onClose(item) {
        //   if (confirm('关闭当前对话?')) {
        //     this.$store.commit(
        //       CHAT_DELETE,
        //       item
        //     );
        //   }
        // },
        // /**
        //  * 退出房间, 删除会话.
        //  * @param {NavItem} item
        //  */
        // onDisconnect(item) {
        //   let $this = this;
        //   let proto = new Room({
        //     session: item.session,
        //     scene: item.scene,
        //   });
        //
        //   // 退出房价.
        //   $this.$socket.emit('LEAVE', new Request({
        //     token: $this.$store.getters.token,
        //     proto,
        //   }));
        //
        //   // 删除会话.
        //   $this.onClose(item);
        // },
        // onConnect(item) {
        //   let $this = this;
        //   let proto = new Room({
        //     session: item.session,
        //     scene: item.scene,
        //   });
        //
        //   $this.onSelect(item);
        //
        //   // 进入房间.
        //   $this.$socket.emit('JOIN', new Request({
        //     token: $this.$store.getters.token,
        //     proto,
        //   }));
        //
        // },

      },

  }
</script>

<style scoped>
</style>