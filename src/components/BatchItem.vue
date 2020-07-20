<template>
    <div class="chat-row"
         v-bind:class="{'chat-receive': isReceive, 'chat-say':isSelf, 'chat-system': isSystem }"
    >
        <div class="chat-title" v-if="isReceive">
            <span class="chat-author">{{ batch.creatorName }}</span>
            <span class="chat-date"> {{batch.date}} </span>
        </div>
        <div v-if="isSystem">{{ batch.lastMessage() }}</div>
        <div v-if="!isSystem">
            <template v-for="message of batch.messages">
                <message-bili
                    v-if="isBili(message.type)"
                    :message="message"
                    :key="message.id"
                ></message-bili>
                <message-text
                    v-if="isText(message.type)"
                    :message="message"
                    :key="message.id"
                >
                </message-text>
            </template>
        </div>
    </div>
</template>

<script>
  import {
    MessageBatch,
    MODE_BOT,
    MODE_SELF,
    MODE_SYSTEM,
    MODE_USER,
  } from '../protocals/MessageBatch';
  import MessageBili from "./MessageBili";
  import MessageText from "./MessageText";
  import {
    MESSAGE_TEXT,
    MESSAGE_BILI,
  } from "../constants";

  export default {
    name: "BatchItem",
    components: {
      MessageText,
      MessageBili
    },
    props: {
      batch: {
          type: MessageBatch,
          default() {
            return MessageBatch.fake(true);
          }
      }
    },
    methods : {
      isText : (type) => type === MESSAGE_TEXT,
      isBili : (type) => type === MESSAGE_BILI,
    },
    computed : {
      isSelf() {
        return this.batch.mode === MODE_SELF;
      },
      isSystem() {
        return this.batch.mode === MODE_SYSTEM;
      },
      isReceive() {
        let mode = this.batch.mode;
        return mode === MODE_BOT || MODE_USER === mode;
      }
    }
  }
</script>

<style scoped>

</style>