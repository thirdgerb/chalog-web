<template>
    <div class="chat-content" :class="{'chat-pick': picked}">
        <span v-if="!rendered" class="chat-bubble">{{ text }}</span>
        <span v-if="rendered" class="chat-bubble" v-html="rendered"></span>
    </div>
</template>

<script>
    import {TextMessage} from "../socketio/Message";
    import {markdown} from "markdown";

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
      rendered: '',
    }),
    mounted() {
      let $this = this;
      let messageText = $this.message.text;
      $this.text = messageText;

      if ($this.message.md) {
        $this.rendered = markdown.toHTML(messageText);
        return;
      }

      let lines = messageText.split("\n");
      if (lines.length > 1) {
        let output = lines.join("\n\n");
        $this.rendered = markdown.toHTML(output);
      }
    }

  }
</script>

<style scoped>

</style>