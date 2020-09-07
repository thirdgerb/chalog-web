<template>
    <v-dialog v-model="play" width="600" max-width="80%" dark>
        <v-card >
            <div class="bili-video">
                <iframe
                    :src="src"
                    ref="bili"
                    scrolling="no"
                    border="0"
                    frameborder="no"
                    framespacing="0"
                    allowfullscreen="true"
                ></iframe>
            </div>
            <div v-if="hasSuggestions">
                <v-card-text class="bili-options">
                    <v-btn
                        class="mx-1 mt-2"
                        dark
                        outlined
                        color="success"
                        shaped
                        @click="sendSuggestion(suggestion)"
                        v-for="(suggestion, index) in suggestions"
                        :key="index"
                    >{{index}} {{suggestion}}</v-btn>
                </v-card-text>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
    import {BILI_TOGGLE} from "../constants";
    import {TextMessage} from "../socketio/Message"

    export default {
    name: "biliVideo",
    props:["alive"],
    data: () => ({
      selected: false,
      suggestions: {},
      played: 0,
    }),
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
        let auto = $this.play && ($this.played > 0);
        return $this.resource
          + '&as_wide=1&danmaku=0&high_quality=1'
          + ( auto ? '&autoplay=1' : '')
          ;
      },
      resource() {
        return this.$store.state.bili.resource;
      },
      commits () {
        return this.$store.state.chat.commit;
      },
      hasSuggestions () {
        let suggestions = this.suggestions;
        return Object.keys(suggestions).length > 0;
      },
    },
    watch: {
      resource (newVal, oldVal) {
        if (oldVal && newVal !== oldVal) {
          this.played += 1;
        }
      },
      commits() {
        let $this = this;
        let chat = $this.$store.state.chat.connected[$this.alive];
        if (!chat) {
          $this.suggestions = {};
          return;
        }

        let suggestions = chat.suggestions;
        let keys = Object.keys(suggestions);

        let lists = {};
        for (let key of keys) {
          if (typeof(key) === 'number' || key.length < 3) {
            lists['[' + key + ']'] = suggestions[key];
          } else {
            lists[key] = suggestions[key];
          }
        }
        $this.suggestions = lists;
      }
    },
    methods: {
      sendSuggestion(suggestion){
        let $this = this;

        // 防止重复点击
        if ($this.selected) {
          return;
        }
        $this.selected = true;

        let message = TextMessage.create(suggestion);
        $this.$emit('deliver-message', message);
        let url = $this.$store.state.bili.resource;

        setTimeout(function() {
          // 还是同一个视频?
          if (url === $this.$store.state.bili.resource) {
            $this.play = false;
          }
          $this.selected = false;
        }, 800);
      },
    }
  }
</script>

<style scoped>

.bili-video {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
}
.bili-options{
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
}

.bili-video iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left:0;

}
</style>