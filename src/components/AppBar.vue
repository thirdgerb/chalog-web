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
        <v-badge
        v-if="isAtChat"
        avatar
        dot
        :value="unread > 0 "
        color="error"
        offset-x="22"
        offset-y="22"
        >
            <v-btn icon @click.stop="toggleBell"><v-icon>mdi-bell</v-icon></v-btn>
        </v-badge>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-app-bar-nav-icon
            v-if="isLogin"
            @click.stop="toggleMenu">
        </v-app-bar-nav-icon>
    </v-app-bar>
</template>

<script>
    import {LAYOUT_DRAWER_TOGGLE, LAYOUT_MENU_TOGGLE} from "../constants";

    export default {
      name: "AppBar",

        computed: {
          isAtChat() {
            return this.$route.name === 'chat';
          },
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

            if ($this.$route.name === 'chat') {
              let session = $this.$route.params.session;
              let chat = $this.$store.state.chat.connected[session];
              return chat ? chat.title : version;
            }

            return version;
          }
        },
        methods: {
          toggleMenu() {
            let $this = this;
            $this.$store.commit(LAYOUT_MENU_TOGGLE, null);
          },
          toggleBell() {
            let $this = this;
            $this.$store.commit(LAYOUT_DRAWER_TOGGLE, null);
          },
        }
    }
</script>

<style scoped>

</style>