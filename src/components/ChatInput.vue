<template>
    <div class="chat-input" >
      <v-text-field ref="inputbox" placeholder="请输入..."
      v-model="message"
      rows="1"
      outlined
      :loading="loading"
      :error="hasError"
      :error-messages="error"
      :success="success"
      light
      flat
      single-line
      append-icon="mdi-send"
      clearable
      dense
      filled
      no-resize
      background-color="white"
      @click:append="sendMessage"
      @click:clear="clearMessage"
      v-on:keyup.enter.prevent.stop="sendMessage"
      v-on:blur="clearError"
      ></v-text-field>
    </div>
</template>

<script>
  import {
    TOGGLE_DRAWER,
    VIDEO_PLAY_SETTER,
    PLAY_VIDEO,
    // CHAT_COMMIT_MESSAGE,
    // ACTION_INPUT_MESSAGE,
  } from '../constants';
  import TextMessage from '../protocals/TextMessage';
  // import Input from "../socketio/Input";
  // import {MessageBatch} from "../protocals/MessageBatch";
  // import Input from "../socketio/Input";

  const rules = {
    require: value => (value.length > 0) || '消息不能为空',
    counter: value => (value.length <= 100) || '最多输入100字',
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
        rules: rules,
        success: false,
        focus: false,
      }
    },
    created() {
      this.focus = true;
    },
    methods : {
      sendMessage() {
        let $this = this;
        if ($this.loading) {
          return;
        }

        let error;
        let rulesArr = Object.values(rules);
        let message = $this.message;

        // 参数校验
        for (let rule of rulesArr) {
          error = rule(message);
          if (error !== true) {
            $this.error = error;
            return;
          }
        }

        message = message.trim();
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
        $this.$emit('deliver-message', text);

        // 清空输入框.
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