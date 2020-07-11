<template>
    <div>
        <!-- 需要实现一个视频消息 -->
        <!-- 需要实现一个二维码消息 -->

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

    
        <div  class="chat-row chat-say">
            <div class="chat-content">
                <span  class="chat-bubble chat-pick">hello world</span>
            </div>
        </div>
    
        <div  class="chat-row chat-say">
            <div class="chat-content">
                <span  class="chat-bubble">1. hello worldhello worldhello worldhello worldhello worldhello worldhello d</span>
                <span  class="chat-bubble">2. hello world</span>
                <span  class="chat-bubble">3. hello world</span>
            </div>
        </div>

    </div>

</template>
<script>
  import VueQr from 'vue-qr'
  import {VIDEO_SETTER} from "../constants";

  export default {
    name: "ChatList",
    components: {
      VueQr
    },
    methods : {
      play () {
        this.$store.commit(VIDEO_SETTER, true);
      }
    }
  }
</script>

<style scoped>

</style>