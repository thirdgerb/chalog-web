<template>
    <div class="chat-content" :class="{'chat-pick': picked}">
        <span v-if="!markdown" class="chat-bubble">{{ text }}</span>
        <div v-if="markdown" class="chat-bubble" v-html="markdown"></div>
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
    }),
    mounted() {
      let $this = this;
      let messageText = $this.message.text;
      $this.text = messageText;

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
  }
</script>

<style scoped>

</style>