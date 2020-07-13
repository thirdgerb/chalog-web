<template>
    <div class="chat-input" >
      <v-textarea placeholder="请输入..."
      v-model="message"
      rows="1"
      outlined
      :loading="loading"
      :disabled="loading"
      :error="hasError"
      :error-messages="error"
      light
      flat
      append-icon="mdi-send"
      clearable
      dense
      filled
      background-color="white"
      @click:append="sendMessage"
      @click:clear="clearMessage"
      v-on:keyup.enter.prevent.stop="sendMessage"
      v-on:blur="clearError"
      ></v-textarea>
    </div>
</template>

<script>
  import {
    TOGGLE_DRAWER,
    VIDEO_PLAY_SETTER,
    PLAY_VIDEO,
    ACTION_CHAT_DELIVER_MESSAGE,
  } from '../constants';
  import TextMessage from '../protocals/TextMessage';

  const rules = {
    counter: value => (value && value.length <= 100) || '最多输入100字',
    require: value => (value && value.length > 0) || '消息不能为空',
  };

  const commands = [
    VIDEO_PLAY_SETTER,
    TOGGLE_DRAWER,
    PLAY_VIDEO,
  ];

  export default {
    name: "ChatInput",
    data() {
      return {
        message: '',
        busy: false,
        error: '',
        rules: rules
      }
    },
    methods : {
      sendMessage() {
        let $this = this;
        let message = $this.message.trim();
        let error;
        let rulesArr = Object.values(rules);

        // 参数校验
        for (let rule of rulesArr) {
          error = rule(message);
          if (error !== true) {
            $this.error = error;
            return;
          }
        }

        // 检查命令, 执行命令.
        let i = commands.indexOf(message);
        if (i >=0 ) {
          $this.$store.commit(message);
          $this.clearMessage();
          return;
        }

        $this.busy = true;
        setTimeout(function() {
          $this.busy = false;
        }, 1000);

        let text = TextMessage.create(message);

        // 先提交消息.
        $this.$store.dispatch(
          ACTION_CHAT_DELIVER_MESSAGE,
          text
        );

        $this.clearMessage();
        $this.clearError();
      },
      clearMessage() {
        let $this = this;
        $this.message = '';
      },
      clearError() {
        this.error = '';
      }

    },
    computed: {
      hasError() {
        return this.error.length > 0;
      },
      loading() {
        return this.busy;
      },
    }

  }
</script>

<style scoped>

</style>