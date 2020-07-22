<template>
    <div >
        <div class="chat-row chat-receive">
            <div class="chat-content">
                <span class="chat-bubble">
                    <span>hello world {{ session }}</span>
                </span>
            </div>
        </div>
        <batch-item
          v-for="batch in getBatches()"
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
             :class="{'selected':true}">
            <div class="chat-content">
                <v-btn class="chat-bubble" text
                  v-for="(suggestion, index) in chat.suggestions"
                  :key="index"
                >{{ suggestion }}</v-btn>
            </div>
        </div>
    </div>

</template>
<script>
  // import BatchItem from "./BatchItem";
  // import ChatInfo from "../protocals/ChatInfo";
  // import TextMessage from "../protocals/TextMessage";
  // import Request from "../socketio/Request";
  // import Room from "../socketio/Room";
  // import {getResponse} from "../utils";
  import BatchItem from "./BatchItem";

  export default {
    name: "ChatList",
    props : ['chat'],
    components: {
      BatchItem,
    },
    // sockets : {
    //   message(res) {
    //     let $this = this;
    //     getResponse($this.$store, res, function(store, proto) {
    //       console.log(proto);
    //     });
    //   }
    // },
    // methods : {
    //   selectSuggestion(suggestion) {
    //     let text = TextMessage.create(suggestion);
    //     this.$emit('deliver-message', text);
    //   },
    // },
    methods: {
      getBatches() {
        return Object.values(this.chat.batches);
      }
    },
    computed : {
      session() {
        return this.chat.session;
      }
      // chat () {
      //   let $this = this;
      //   return $this.$store.state.chat.connected[$this.session];
      // },
      // isSuggestionSelected() {
      //   /**
      //    * @type {ChatInfo} chat
      //    */
      //   let chat = this.chat;
      //   let suggestions = chat.suggestions;
      //   let hasSuggestion = suggestions && suggestions.length > 0;
      //   return chat.isSaid || hasSuggestion;
      // },
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