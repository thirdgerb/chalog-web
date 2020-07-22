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
        <v-toolbar-title>{{ version }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text>v0.1</v-btn>
        <v-btn icon><v-icon >mdi-github</v-icon></v-btn>
    </v-app-bar>
</template>

<script>
    import {LAYOUT_DRAWER_TOGGLE} from "../store/layout";

    export default {
      name: "AppBar",

        computed: {
          version() {
            return process.env.VUE_APP_VERSION;
          },

          isLogin() {
            return this.$store.getters.isUserLogin;
          },
          drawer : {
            get() {
              return this.$store.state.layout.drawer;
            },
            set(val) {
              this.$store.commit(LAYOUT_DRAWER_TOGGLE, !!val);
            }
          }
        },
        methods: {
          toggleDrawer() {
            let $this = this;
            let drawer = $this.$store.state.layout.drawer;
            $this.$store.commit(LAYOUT_DRAWER_TOGGLE, !drawer);
          }
        }
    }
</script>

<style scoped>

</style>