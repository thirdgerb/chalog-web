<template>
    <div id="chat" class="grey lighten-3 bubble-container">
        <div class="bubble-wrap" style="padding-bottom: 100px;">
            <template v-for="message in messages">
                <div
                    v-bind:key="message.id"
                    v-html="message.title">

                </div>
            </template>
        </div>
        <div class="input-wrap">
            <textarea placeholder="请输入..."></textarea>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Chat",
        data() {
          return {
            messages : [
              {
                id : 1,
                title: 123,

              }

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