<template>
  <v-footer
  fixed
  app
  dense
  padless
  inset
  >
    <div class="chat-input" >
      <v-text-field ref="inputbox"
      placeholder="请输入..."
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
      @click:append="buttonSendMessage"
      @click:prepend-inner="changeToBot"
      @click:clear="clearMessage"
      v-on:keyup.shift.enter.prevent.stop="sendMessage"
      v-on:blur="clearError"
      ></v-text-field>
    </div>
 </v-footer>
</template>

<script>
  import {TextMessage} from "../socketio/Message";
  import {
    CHAT_ACTION_TOGGLE_MANUAL,
    LAYOUT_SNACK_BAR_TOGGLE,
  } from "../constants";

  const rules = {
    require: value => (value.length > 0) || '消息不能为空',
    counter: value => (value.length <= 100) || '最多输入100字',
  };

  export default {
    name: "ChatInput",
    props: {
      alive : {
        type: Object,
      }
    },
    data() {
      return {
        message: '',
        busy: false,
        error: '',
        rules: rules,
        focus: false,
        botChanging: false,
        announced: false,
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
      buttonSendMessage(){
        let $this = this;
        if (!$this.announced) {
          $this.$store.commit(
            LAYOUT_SNACK_BAR_TOGGLE,
            "发消息快捷键为 shift + enter"
          )
        }
        $this.announced = true;
        $this.sendMessage()
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
        }, 2000);

        $this.$store.dispatch(
          CHAT_ACTION_TOGGLE_MANUAL,
          {
            session: $this.alive.session,
            alive: $this.alive.session,
            bot : null
          }
        );
      },
    },
    computed: {
      hasError() {
        return this.error.length > 0;
      },
      loading() {
        let $this = this;
        return $this.busy
          && !$this.$store.state.socket.connecting;
      },
      prependIcon() {
        let $this = this;
        let bot = $this.alive.bot;
        if (bot === true) {
          return 'mdi-robot';
        }
        if (bot === false) {
          return 'mdi-face-agent';
        }
        return null;
      }
    }

  }
</script>

<style scoped>

</style>