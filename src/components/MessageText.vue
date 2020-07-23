<template>
    <div class="chat-content" :class="{'chat-pick': picked}">
        <span class="chat-bubble">{{ message.text }}</span>
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
      }

    }
  }
</script>

<style scoped>

</style>