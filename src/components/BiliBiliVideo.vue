<template>
    <v-dialog
        v-model="play"
        max-width="800px"
    >

        <v-sheet height="100%">
            <iframe
                :src="src"
                scrolling="no"
                border="0"
                frameborder="no"
                framespacing="0"
                allowfullscreen="true"
                style="width:100%;height: calc(100vw * 9 / 16);max-height:100%"
            ></iframe>
        </v-sheet>

    </v-dialog>
</template>

<script>
  import {VIDEO_SETTER} from '../constants';

  export default {
    name: "VideoDialog",
    data() {
      return {
        video : {
          url: '//player.bilibili.com/player.html?aid=243815965&bvid=BV1iv411i7tq&cid=210478701&page=1'
        },

      }
    },
    computed : {
      play: {
        get() {
          return this.$store.state.video.play;
        },
        set(val) {
          this.$store.commit(VIDEO_SETTER, val);
        }
      } ,
      src()  {
        let $this = this;
        let url = $this.$store.state.video.url;

        return url
          + '&as_wide=1&danmaku=0'
          + '&autoplay=1'
          ;
      }
    }
  }
</script>

<style scoped>

</style>