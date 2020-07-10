<template>
    <div class="grey lighten-3 bubble-container">
        <v-container class="bubble-wrap" style="padding-bottom: 100px;">
            <!--- 消息列表 --->
            <div class="bubble say" v-for="(message, index) in messages" :key="index">
              <span class="bubble-content">
                    <span class="bubble-button bubble-pick">{{ message.text }}</span>
              </span>
            </div>
            <!--- suggestion --->
            <div class="bubble reply say">
                <span class="bubble-content">
                    <span class="bubble-button" >退出</span>
                    <span class="bubble-button" >返回上一层</span>
                </span>
            </div>
            <!--- input --->
            <div class="input-wrap">
                <textarea placeholder="请输入..."></textarea>
            </div>
        </v-container>


    </div>
</template>

<script>
    import {chat1} from '../data/demo';

    export default {
        name: "Chat",
        data() {
          return {
            chat : chat1,
            messages : [
              {isInput:false, text:"请输入信息. "},
              {isInput:true, text:"#home"},
              {isInput:false, text:"请输入信息. "},
              {isInput:true, text:"#home"},
              {isInput:false, text:"请输入信息. "},
              {isInput:true, text:"#home"},
              {isInput:false, text:"请输入信息. "},
              {isInput:true, text:"#home"},
            ],
          }

        },
    }
</script>

<style scoped>
@import "../assets/bubbles/input.css";
@import "../assets/bubbles/reply.css";
@import "../assets/bubbles/says.css";
@import "../assets/bubbles/setup.css";
@import "../assets/bubbles/typing.css";
</style>