<template>
    <div class="chat-content">
        <span class="chat-bubble">
            <v-btn
                    class="mx-2" dark large color="purple"
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

        let event = {
          type: PLAY_VIDEO,
          play : true,
          url: $this.message.url
        };

        console.log('event', event);
        $this.$store.commit(event);
      }
    }
  }
</script>

<style scoped>

</style>