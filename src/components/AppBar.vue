<template>
    <!-- app bar -->
    <v-app-bar
        app
        color="indigo"
        dark
        dense
        flat
        abusolute
    >

        <v-app-bar-nav-icon
            v-if="isLogin"
            @click.stop="toggleDrawer">
        </v-app-bar-nav-icon>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text href="https://communechatbot.com">v0.1</v-btn>
        <v-badge
        avatar
        dot
        :value="unread > 0 "
        color="error"
        offset-x="22"
        offset-y="22"
        >
            <v-btn icon @click.stop="toggleBell"><v-icon>mdi-bell</v-icon></v-btn>
        </v-badge>
        <v-btn icon><v-icon>mdi-github</v-icon></v-btn>
    </v-app-bar>
</template>

<script>
    import {LAYOUT_DRAWER_TOGGLE} from "../store/layout";

    export default {
      name: "AppBar",

        computed: {
          isLogin() {
            return this.$store.getters.isUserLogin;
          },
          unread() {
            return this.$store.state.chat.unread;
          },
          drawer : {
            get() {
              return this.$store.state.layout.drawer;
            },
            set(val) {
              this.$store.commit(LAYOUT_DRAWER_TOGGLE, !!val);
            }
          },
          title () {
            let $this = this;
            let version = process.env.VUE_APP_VERSION;
            if (!$this.isLogin) {
              return version;
            }
            let chat = $this.$store.getters.aliveChat;
            return chat ? chat.title : version;
          }
        },
        methods: {
          toggleDrawer() {
            let $this = this;
            let drawer = $this.$store.state.layout.drawer;
            $this.$store.commit(LAYOUT_DRAWER_TOGGLE, !drawer);
          },
          toggleBell() {
            let $this = this;
            let unread = $this.unread;
            if (unread > 0) {
              $this.$store.commit(LAYOUT_DRAWER_TOGGLE, true);

            }
          }
        }
    }
</script>

<style scoped>

</style>