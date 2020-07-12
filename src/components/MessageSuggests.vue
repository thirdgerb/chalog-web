<template>
    <div  class="chat-row chat-say">
        <div class="chat-content">
            <span class="chat-bubble"
                  v-for="(suggestion, index) in suggestions"
                  :key="index">{{ suggestion }}</span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "MessageSuggests",
    props : {
      suggestions : {
        default() {
          return {
            a: '选项1',
            b: '选项2',
            c: '选项3',
            d: '选项4',
          };
        }
      }
    },
  }
</script>

<style scoped>

</style>