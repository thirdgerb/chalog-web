<template>
    <div class="chat-list" >
        <div class="chat-row chat-system" v-if="!chat.hasElderMessages">
            ~ 没有更多消息了 ~
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
        <div class="chat-row chat-say chat-suggestion" v-show="!chat.said">
            <div class="chat-content"
                 v-for="(suggestion, index) in suggestionList"
                 :key="index"
            >
                <div class="chat-bubble"
                  @click="select(suggestion)"
                >{{ suggestion }} {{ index }}</div>
            </div>
        </div>
    </div>
</template>
<script>
  import BatchItem from "./BatchItem";
  import {TextMessage} from "../socketio/Message";

  export default {
    name: "ChatList",
    props : ['chat', 'count'],
    data : () => ({
    }),
    components: {
      BatchItem,
    },
    methods: {
      getBatches() {
        return Object.values(this.chat.batches);
      },
      select(suggestion) {

        let $this = this;
        let message = TextMessage.create(suggestion);

        $this.$emit('deliver-message', message);
        $this.chat.suggestions = [];
      },
    },
    computed : {
      session() {
        return this.chat.session;
      },
      suggestions() {
        return Object.values(this.chat.suggestions);
      },
      suggestionList() {
        let chat = this.chat;
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
        return lists;
      },
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