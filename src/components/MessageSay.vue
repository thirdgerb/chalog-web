<template>
    <div  class="chat-row chat-say">
        <div class="chat-content">
            <span class="chat-bubble chat-pick">{{ message.text }}</span>
        </div>
    </div>
</template>

<script>
  import TextMessage from '../protocals/TextMessage';
  export default {
    name: "MessageSay",
    props : {
      message : {
        type: TextMessage,
        default() {
          return TextMessage.fake()
        }
      },
    }
  }
</script>

<style scoped>

</style>