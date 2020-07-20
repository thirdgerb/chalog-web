<template>
    <div>
        <batch-item
          v-for="batch in batches"
          v-bind:key="batch.batchId"
          v-bind:batch="batch"
        ></batch-item>

        <!-- loading -->
        <div class="chat-row chat-receive" v-show="chat.loading">
            <div class="chat-content">
            <span class="chat-bubble">
                <span class="dot_1 dot"></span>
                <span class="dot_2 dot"></span>
                <span class="dot_3 dot"></span>
            </span>
            </div>
        </div>

        <!-- suggestion -->
        <div class="chat-row chat-say chat-suggestion"
             :class="{'selected':isSuggestionSelected}">
            <div class="chat-content">
                <v-btn class="chat-bubble" text
                  v-for="(suggestion, index) in chat.suggestions"
                  :key="index"
                  @click="selectSuggestion(suggestion)"
                >{{ suggestion }}</v-btn>
            </div>
        </div>
    </div>

</template>
<script>
  import BatchItem from "./BatchItem";
  import ChatInfo from "../protocals/ChatInfo";
  import TextMessage from "../protocals/TextMessage";
  import Request from "../socketio/Request";
  import Room from "../socketio/Room";
  import {getResponse} from "../utils";

  export default {
    name: "ChatList",
    props : {
      chat : ChatInfo,
    },
    components: {
      BatchItem,
    },
    created() {
      let $this = this;
      let req = new Request({
        token: $this.$store.state.user.token,
        proto: new Room({
          session: $this.chat.session,
          scene: $this.chat.scene,
        })
      });

      // 监听频道.
      this.$socket.emit('JOIN', req);
    },
    destroyed() {

      let $this = this;
      let req = new Request({
        token: $this.$store.state.user.token,
        proto: new Room({session: $this.chat.session})
      });

      // 监听频道.
      this.$socket.emit('LEAVE', req);

    },
    sockets : {
      message(res) {
        let $this = this;
        getResponse($this.$store, res, function(store, proto) {
          console.log(proto);
        });
      }
    },
    methods : {
      selectSuggestion(suggestion) {
        let text = TextMessage.create(suggestion);
        this.$emit('deliver-message', text);
      },
    },
    computed : {
      batches() {
        return this.chat.batches;
      },
      isSuggestionSelected() {
        /**
         * @type {ChatInfo} chat
         */
        let chat = this.chat;
        let suggestions = chat.suggestions;
        let hasSuggestion = suggestions && suggestions.length > 0;
        return chat.isSaid || hasSuggestion;
      }
    }
  }
</script>

<style scoped>
    /* style "loading" or "typing" stae */

    .bubble-typing {
        width: 38px;
        padding: 12px 16px;
        height: 8px;
    }
    .dot {
        background-color: rgb(255,255,255);
        float: left;
        height: 7px;
        margin-left: 4px;
        width: 7px;
        animation-name: bounce_dot;
        animation-duration: 2.24s;
        animation-iteration-count: infinite;
        animation-direction: normal;
        border-radius: 5px;
    }
    .dot_1 { animation-delay: 0.45s; }
    .dot_2 { animation-delay: 1.05s; }
    .dot_3 { animation-delay: 1.35s; }
    @keyframes bounce_dot {
        0% {}
        50% { background-color:rgb(0,0,0); }
        100% {}
    }


</style>