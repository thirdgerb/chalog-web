<template>
    <div class="chat-input" >
      <v-text-field ref="inputbox" placeholder="请输入..."
      v-model="message"
      rows="1"
      outlined
      :loading="loading"
      :error="hasError"
      :error-messages="error"
      :success="!loading"
      light
      flat
      single-line
      append-icon="mdi-send"
      :prepend-inner-icon="prependIcon"
      clearable
      dense
      filled
      no-resize
      background-color="white"
      @click:append="sendMessage"
      @click:prepend-inner="changeToBot"
      @click:clear="clearMessage"
      v-on:keyup.enter.prevent.stop="sendMessage"
      v-on:blur="clearError"
      ></v-text-field>
    </div>
</template>

<script>
  import {TextMessage} from "../socketio/Message";
  import {
    CHAT_ACTION_TOGGLE_MANUAL,
  } from "../constants";

  const rules = {
    require: value => (value.length > 0) || '消息不能为空',
    counter: value => (value.length <= 100) || '最多输入100字',
  };

  export default {
    name: "ChatInput",
    data() {
      return {
        message: '',
        busy: false,
        error: '',
        rules: rules,
        focus: false,
        botChanging: false,
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
        setTimeout(function() {
          $this.busy = false;
        }, 1000);

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

        $this.busy = true;


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
      },
      changeToBot() {
        let $this = this;

        // 不要按太频繁.
        if ($this.botChanging) {
          return;
        }
        $this.botChanging = true;
        setTimeout(function(){
          $this.botChanging = false;
        }, 4000);

        let alive = $this.$store.getters.aliveChat;

        if (!alive) {
          return;
        }

        // 切换到人工的话, 给管理员发消息
        let manual = !alive.bot;
        $this.$store.dispatch(
          CHAT_ACTION_TOGGLE_MANUAL,
          {manual, scene:alive.scene, session:alive.session}
        );

      },
    },
    computed: {
      hasError() {
        return this.error.length > 0;
      },
      loading() {
        return this.busy;
      },
      prependIcon() {
        let alive = this.$store.getters.aliveChat;
        if (!alive) {
          return;
        }
        return alive.bot ?  'mdi-robot' : 'mdi-face-agent';
      }
    }

  }
</script>

<style scoped>

</style>