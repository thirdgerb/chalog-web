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
      v-on:keyup.enter="sendMessage"
      v-on:blur="clearError"
      ></v-textarea>
    </div>
</template>

<script>
const rules = {
  counter: value => (value && value.length <= 100) || '最多输入100字',
  require: value => (value && value.length > 0) || '消息不能为空',
};
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

        // 设定输入忙.
        $this.busy = true;
        setTimeout(function() {
            $this.busy = false;
        }, 500);
        console.log('send');

        // $this.clearMessage();
      },
      clearMessage() {
        let $this = this;
        $this.message = '';
        $this.error = '';
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
      width() {
        let dom = document.getElementById('chat-container');
        return dom ? dom.offsetHeight + 'px' : 200 + 'px';
      }
    }

  }
</script>

<style scoped>

</style>