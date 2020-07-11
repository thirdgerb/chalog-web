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
    <!-- subscribe chats -->
    <v-list dense nav>
      <v-list-item-group >
        <template v-for="(item, index) in items">
            <chat-item
               :item="item"
               :key="index" ></chat-item>
        </template>
      </v-list-item-group>
    </v-list>
    <template v-if="hasIncomingChat">
        <v-subheader>未连接</v-subheader>
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
            this.$store.state.layout.drawer = val;
          }
        },
        items () {
          return this.$store.state.chats;
        },
        hasIncomingChat() {
          let keys = Object.keys(this.$store.state.incomingChats);
          return keys.length > 0;
        },
        incoming() {
          return this.$store.state.incomingChats;
        }
      }
  }
</script>

<style scoped>

</style>