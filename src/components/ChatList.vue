<template>
    <div >
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">{{ chat.sessionId}}</span>
                <span class="chat-date">20:19:31</span>
            </div>
            <div class="chat-content">
                <span class="chat-bubble">微信公众号请扫描二维码</span>
            </div>
            <div class="chat-content">
                    <span class="chat-bubble"><vue-qr text="xxx" :size="150"></vue-qr></span>
            </div>
            <div class="chat-content">
                <span class="chat-bubble">在公众号对话框中输入以下内容, 可在公众号对话中操作本网页</span>
            </div>
            <div class="chat-content" >
                <span class="chat-bubble">.join 1234</span>
            </div>
        </div>

        <batch-item
          v-for="batch in chat.batches"
          v-bind:key="batch.batchId"
          v-bind:batch="batch"
        ></batch-item>
        <div class="chat-row chat-say" v-show="chat.suggestions.length > 0">
            <div class="chat-content">
            <span class="chat-bubble"
                  v-for="(suggestion, index) in chat.suggestions"
                  :key="index">{{ suggestion }}</span>
            </div>
        </div>
    </div>

</template>
<script>
  import VueQr from 'vue-qr'

  import BatchItem from "./BatchItem";
  import ChatInfo from "../protocals/ChatInfo";

  export default {
    name: "ChatList",
    props : {
      chat : ChatInfo,
    },
    components: {
      VueQr,
      BatchItem,
    },
    methods : {
    }
  }
</script>

<style scoped>

</style>