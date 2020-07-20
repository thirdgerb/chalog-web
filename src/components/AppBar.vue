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
            @click.stop="TOGGLE_DRAWER">
        </v-app-bar-nav-icon>
        <v-toolbar-title
            @click.stop="home">Commune 0.2</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text>v0.1</v-btn>
        <v-btn icon><v-icon >mdi-github</v-icon></v-btn>
        <v-btn text @click.stop="submit">提交</v-btn>

    </v-app-bar>
</template>

<script>
    import { mapMutations } from 'vuex'
    import {
      TOGGLE_DRAWER,
      PLAY_VIDEO, CHAT_COMMIT_MESSAGE,
    } from "../constants";
    import TextMessage from "../protocals/TextMessage";
    import {MessageBatch} from "../protocals/MessageBatch";

    export default {
      name: "AppBar",

        computed: {
          isLogin() {
            return this.$store.getters.isLogin;
          },
        },
        methods: {
          ...mapMutations([
            TOGGLE_DRAWER,
          ]),
          play() {
              this.$store.commit(
                PLAY_VIDEO,
                 "//player.bilibili.com/player.html?aid=838871423&bvid=BV1w54y1S7Cs&cid=210198185&page=1"
              );

          },

          home () {
            let $this = this;
            if ($this.$router.currentRoute.name !== 'index') {
              this.$router.push({name:'index'})
            }

          },

          submit() {
            let text = TextMessage.create('hello');
            let batch = MessageBatch.createByMessage(text, this.$store.state.user);

            this.$store.commit(
              CHAT_COMMIT_MESSAGE,
              {session:this.$store.state.menu.alive.session, batch}
            )
          }

        }
    }
</script>

<style scoped>

</style>