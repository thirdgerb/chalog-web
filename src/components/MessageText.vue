<template>
    <div class="chat-content"
         :class="{'chat-pick': picked, 'chat-notice':chatNotice, 'chat-error':chatError}" >
        <div v-if="!markdown" class="chat-bubble">{{ text }}</div>
        <div v-if="markdown" class="chat-bubble" v-html="markdown"></div>
        <div class="chat-clear"></div>
    </div>
</template>

<script>
    import {TextMessage} from "../socketio/Message";

    export default {
    name: "MessageText",
    props : {
      message :TextMessage,
      session: String,
      picked : {
        type: Boolean,
        default: false
      },
    },
    data: () => ({
      text : '',
      markdown: '',
      level : '',
    }),
    mounted() {
      let $this = this;
      let messageText = $this.message.text;
      $this.text = messageText;
      $this.level = $this.message.level;

      if ($this.message.md) {
        $this.markdown = window.marked(messageText);
        return;
      }

      let lines = messageText.split("\n");
      if (lines.length > 1) {
        let output = lines.join("<br>");
        $this.markdown = window.marked(output);
      }
    },
    computed: {
      chatNotice() {
        let level = this.level;
        return level === 'warning' || level === 'notice';
      },
      chatError() {
        let level = this.level;
        return level === 'error';
      }
    }
  }
</script>

<style scoped>

</style>