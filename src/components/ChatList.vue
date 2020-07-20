<template>
    <div>
        <!--<div class="chat-row chat-receive">-->
            <!--<div class="chat-title">-->
                <!--<span class="chat-author">{{ chat.session}}</span>-->
                <!--<span class="chat-date">20:19:31</span>-->
            <!--</div>-->
            <!--<div class="chat-content">-->
                <!--<span class="chat-bubble">微信公众号请扫描二维码</span>-->
            <!--</div>-->
            <!--<div class="chat-content">-->
                <!--<span class="chat-bubble">在公众号对话框中输入以下内容, 可在公众号对话中操作本网页</span>-->
            <!--</div>-->
            <!--<div class="chat-content" >-->
                <!--<span class="chat-bubble">.join 1234</span>-->
            <!--</div>-->
        <!--</div>-->

        <batch-item
          v-for="batch in chat.batches"
          v-bind:key="batch.batchId"
          v-bind:batch="batch"
        ></batch-item>
        <div class="chat-row chat-receive" v-show="chat.loading">
            <div class="chat-content">
            <span class="chat-bubble">
                <span class="dot_1 dot"></span>
                <span class="dot_2 dot"></span>
                <span class="dot_3 dot"></span>
            </span>
            </div>
        </div>
        <div class="chat-row chat-say chat-suggestion"
             :class="{'selected':isSuggestionSelected}">
            <div class="chat-content">
                <v-btn class="chat-bubble" text
                  v-for="(suggestion, index) in chat.suggestions"
                  :key="index"
                  @click="sendMessage(suggestion)"
                >{{ suggestion }}</v-btn>
            </div>
        </div>
    </div>

</template>
<script>
  // import VueQr from 'vue-qr'

  import BatchItem from "./BatchItem";
  import ChatInfo from "../protocals/ChatInfo";
  import {
    ACTION_CHAT_DELIVER_MESSAGE,
    // CHAT_TO_BOTTOM,
  } from "../constants";
  import TextMessage from "../protocals/TextMessage";
  import Request from "../socketio/Request";
  import Join from "../socketio/Join";
  import Leave from "../socketio/Leave";
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
        proto: new Join({session: $this.chat.session})
      });

      // 监听频道.
      this.$socket.emit('join', req);
    },
    destroyed() {

      let $this = this;
      let req = new Request({
        token: $this.$store.state.user.token,
        proto: new Leave({session: $this.chat.session})
      });

      // 监听频道.
      this.$socket.emit('join', req);

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
      sendMessage(suggestion) {
        let text = TextMessage.create(suggestion);
        this.$store.dispatch(
          ACTION_CHAT_DELIVER_MESSAGE,
          text
        );
      },
    },
    computed : {
      isSuggestionSelected() {
        /**
         * @type {ChatInfo} chat
         */
        let chat = this.chat;
        return chat.isSaid || chat.suggestions.length <= 0
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