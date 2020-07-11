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
        <v-app-bar-nav-icon @click.stop="TOGGLE_DRAWER"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-btn text small @click.stop="play">视频</v-btn>
        <v-btn text small @click.stop="scroll">滚动</v-btn>

    </v-app-bar>
</template>

<script>
    import { mapMutations } from 'vuex'
    import {
      TOGGLE_DRAWER,
      PLAY_VIDEO,
    } from "../constants";

    export default {
      name: "AppBar",

        computed: {


        },
        methods: {
            ...mapMutations([
              TOGGLE_DRAWER,
            ]),
            scroll() {
              this.$vuetify.goTo('#chat-bottom');
            },
          play() {
              this.$store.commit({
                type : PLAY_VIDEO,
                play: true,
                url : "//player.bilibili.com/player.html?aid=838871423&bvid=BV1w54y1S7Cs&cid=210198185&page=1"
              })

          }

        }
    }
</script>

<style scoped>

</style>