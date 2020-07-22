<template>
    <v-dialog v-model="play" width="600">
        <v-sheet  class="bili-video">
            <iframe
                :src="src"
                ref="bili"
                scrolling="no"
                border="0"
                frameborder="no"
                framespacing="0"
                allowfullscreen="true"
            ></iframe>
        </v-sheet>
    </v-dialog>
</template>

<script>
    import {BILI_TOGGLE} from "../store/bili";

    export default {
    name: "biliVideo",
    data() {
      return {
      }
    },
    computed : {
      play: {
        get() {
          return this.$store.state.bili.play;
        },
        set(val) {
          this.$store.commit(BILI_TOGGLE, val);
        }
      } ,
      src()  {
        let $this = this;
        let url = $this.$store.state.bili.resource;

        return url
          + '&as_wide=1&danmaku=0'
          + '&autoplay=1'
          ;
      }
    }
  }
</script>

<style scoped>

.bili-video {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 56.2%;
}
.bili-video iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left:0;

}
</style>