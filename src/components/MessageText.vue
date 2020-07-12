<template>
    <div class="chat-content" :class="{'chat-pick': picked}">
        <span class="chat-bubble">{{ message.text }}</span>
    </div>
</template>

<script>
  import TextMessage from '../protocals/TextMessage';
  export default {
    name: "MessageText",
    props : {
      message : {
        type : TextMessage,
        default() {
            return TextMessage.fake();
        }
      },
      picked : {
        type: Boolean,
        default: false
      }

    }
  }
</script>

<style scoped>

</style>