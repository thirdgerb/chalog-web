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
  import {BILI_PLAY} from '../store/bili';
  import {BiliMessage} from "../socketio/Message";

  export default {
    name: "MessageBili",
    props : {
      message : BiliMessage,
    },
    mounted () {
      let $this = this;
      let resource = $this.message.resource;
      $this.$store.commit(BILI_PLAY, {resource});
    },
    methods : {
      play() {
        let $this = this;
        $this.$store.commit(BILI_PLAY, {resource:$this.message.resource});
      }
    }
  }
</script>

<style scoped>

</style>