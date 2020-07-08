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
    <v-list
        dense
        nav
    >
      <v-list-item-group>
        <chat-item v-for="(item, index) in items"
           :item="item"
           :key="index" ></chat-item>
      </v-list-item-group>
    </v-list>
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
        }
      }
  }
</script>

<style scoped>

</style>