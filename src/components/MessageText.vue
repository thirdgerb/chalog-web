<template>
    <div class="chat-content">
        <span class="chat-bubble">微信公众号请扫描二维码</span>
    </div>
</template>

<script>
  import TextMessage from '../protocals/TextMessage';
  export default {
    name: "MessageText",
    props : {
      type : TextMessage,
      default() {
        return TextMessage.fake();
      }
    }
  }
</script>

<style scoped>

</style>