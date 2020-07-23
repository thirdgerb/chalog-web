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
            @click.stop="toggleMenu">
        </v-app-bar-nav-icon>

        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-badge
        v-if="isLogin"
        avatar
        dot
        :value="unread > 0 "
        color="error"
        offset-x="22"
        offset-y="22"
        >
            <v-btn icon @click.stop="toggleBell"><v-icon>mdi-bell</v-icon></v-btn>
        </v-badge>


    </v-app-bar>
</template>

<script>
    import {LAYOUT_DRAWER_TOGGLE, LAYOUT_MENU_TOGGLE} from "../store/layout";

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
          toggleMenu() {
            let $this = this;
            $this.$store.commit(LAYOUT_MENU_TOGGLE, null);
          },
          toggleBell() {
            let $this = this;
            $this.$store.commit(LAYOUT_DRAWER_TOGGLE, null);
          },
          // commitVideo() {
          //   let $this =this;
          //   // 准备需要发送的消息.
          //   let chat = $this.$store.getters.aliveChat;
          //
          //   let message = BiliMessage.create("//player.bilibili.com/player.html?aid=201417469&bvid=BV1rh411o7Pz&cid=215225970&page=1");
          //   let input = new Input(chat, message);
          //   let request = new Request({proto:input, token:$this.$store.getters.token});
          //
          //   $this.$socket.emit('INPUT', request);
          // }
        }
    }
</script>

<style scoped>

</style>