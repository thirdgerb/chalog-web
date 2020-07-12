<template>
    <div >
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
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
                <span class="chat-bubble">.sync skjfoiwejfksjfljsdkfjsldfj</span>
            </div>
        </div>

        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
                <span class="chat-date">20:19:31</span>
            </div>

            <message-bili></message-bili>
        </div>

        
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
                <span class="chat-date">20:19:31</span>
            </div>
            <message-text></message-text>
        </div>
    
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
                <span class="chat-date">20:19:31</span>
            </div>
            <message-text></message-text>
        </div>
    
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
                <span class="chat-date">20:19:31</span>
            </div>
            <message-text></message-text>
        </div>
    
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
                <span class="chat-date">20:19:31</span>
            </div>
            <div class="chat-content">
                <span class="chat-bubble">hello world</span>
            </div>
        </div>
    
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
                <span class="chat-date">20:19:31</span>
            </div>
            <div class="chat-content">
                <span class="chat-bubble">hello world</span>
            </div>
        </div>
    
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
                <span class="chat-date">20:19:31</span>
            </div>
            <div class="chat-content">
                <span class="chat-bubble">hello world</span>
            </div>
        </div>
    
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
                <span class="chat-date">20:19:31</span>
            </div>
            <div class="chat-content">
                <span class="chat-bubble">hello world</span>
            </div>
        </div>
    
        <div class="chat-row chat-receive">
            <div class="chat-title">
                <span class="chat-author">测试用户</span>
                <span class="chat-date">20:19:31</span>
            </div>
            <div class="chat-content">
                <span class="chat-bubble">hello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello worldhello world</span>
            </div>
        </div>

        <batch-item
          v-for="batch in batches"
          v-bind:key="batch.batchId"
          v-bind:batch="batch"
        ></batch-item>
    
        <div  class="chat-row chat-say">
            <div class="chat-content">
                <span class="chat-bubble chat-pick">hello world</span>
            </div>
        </div>
    
        <message-suggests></message-suggests>
    </div>

</template>
<script>
  import VueQr from 'vue-qr'
  import MessageBili from "./MessageBili";
  import MessageText from "./MessageText";
  import MessageSuggests from "./MessageSuggests";

  import BatchItem from "./BatchItem";
  import MessageBatch from "../protocals/MessageBatch";
  import TextMessage from "../protocals/TextMessage";

  let batch1 = MessageBatch.createByMessage(
    TextMessage.create('nonononono'),
    'test',
    'test'
  );
  let batch2 = MessageBatch.createByMessage(
    TextMessage.create('hahahahahhaj'),
    'test',
    'test',
    false
  );

  export default {
    name: "ChatList",
    components: {
      MessageBili,
      MessageText,
      VueQr,
      MessageSuggests,
      BatchItem,
    },
    data() {

      return {
        batches : [
          batch1,
          batch2
        ],
      }
    },
    methods : {
    }
  }
</script>

<style scoped>

</style>