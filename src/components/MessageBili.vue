<template>
    <div>
        <div class="chat-content">
            <span class="chat-bubble" v-html="text">
            </span>
        </div>
        <div class="chat-content">
            <span class="chat-bubble">
                <v-btn
                    class="mx-2 red lighten-1" dark large
                    @click.stop="play"
                >
                    <v-icon dark>mdi-play-box</v-icon>
                </v-btn>
                 <v-switch
                     v-model="autoPlay"
                     dense
                     label="自动播放"
                 ></v-switch>
            </span>
        </div>
    </div>
</template>

<script>
  import {BILI_PLAY, BILI_ADD} from '../constants';
  import {BiliMessage} from "../socketio/Message";

  export default {
    name: "MessageBili",
    props : {
      message : BiliMessage,
      session: String,
    },
    mounted () {
      let $this = this;
      if ($this.session !== $this.$route.params.session) {
        return;
      }

      let resource = $this.message.resource;
      $this.$store.commit(BILI_ADD, {resource});

      if ($this.$store.state.bili.hasNew && $this.$store.state.bili.autoPlay) {
        $this.play();
      }
    },
    computed: {
      text() {
        return window.marked(this.message.text);
      },
      autoPlay: {
        set: function(val){
          this.$store.state.bili.autoPlay = val;
        },
        get: function(){
          return this.$store.state.bili.autoPlay;
        }
      }

    },
    methods : {
      play() {
        let $this = this;
        let resource = $this.message.resource;
        if (resource) {
          $this.$store.commit(BILI_PLAY, {resource});
        }
      }
    }
  }
</script>

<style scoped>

</style>