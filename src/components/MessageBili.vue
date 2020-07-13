<template>
    <div class="chat-content">
        <span class="chat-bubble">
            <v-btn
                class="mx-2 red lighten-1" dark large
                @click.stop="play"
            >
                <v-icon dark>mdi-play-box</v-icon>
            </v-btn>
        </span>
    </div>
    
</template>

<script>
  import BiliMessage from '../protocals/BiliMessage';
  import {PLAY_VIDEO} from '../constants';

  export default {
    name: "MessageBili",
    props : {
      message : {
        type : BiliMessage,
        default : function() {
          return BiliMessage.fake();
        }
      }
    },
    methods : {
      play() {
        let $this = this;
        $this.$store.commit(PLAY_VIDEO, $this.message.url);
      }
    }
  }
</script>

<style scoped>

</style>