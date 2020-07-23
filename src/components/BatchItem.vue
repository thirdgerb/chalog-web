<template>
    <div class="chat-row"
         v-bind:class="{'chat-receive': isReceive, 'chat-say':isSelf, 'chat-system': isSystem }"
    >
        <div class="chat-title" v-if="isReceive">
            <span class="chat-author">{{ batch.creatorName }}</span>
            <span class="chat-date"> {{batch.date}} </span>
        </div>
        <div v-if="isSystem">{{ batch.lastMessage }}</div>
        <div v-if="!isSystem">
            <template v-for="message of batch.messages">
                <message-bili
                    v-if="isBili(message.type)"
                    :message="message"
                    :session="batch.session"
                    :key="message.id"
                ></message-bili>
                <message-text
                    v-if="isText(message.type)"
                    :message="message"
                    :session="batch.session"
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
    BATCH_MODE_BOT,
    BATCH_MODE_SELF,
    BATCH_MODE_SYSTEM,
    BATCH_MODE_USER,
  } from '../socketio/MessageBatch';
  import {MESSAGE_BILI, MESSAGE_TEXT} from "../socketio/Message";
  import MessageBili from "./MessageBili";
  import MessageText from "./MessageText";
  
  export default {
    name: "BatchItem",
    components: {
      MessageText,
      MessageBili
    },
    props: {
      batch:  MessageBatch,
    },
    methods : {
      isText : (type) => type === MESSAGE_TEXT,
      isBili : (type) => type === MESSAGE_BILI,
    },
    computed : {
      isSelf() {
        return this.batch.mode === BATCH_MODE_SELF;
      },
      isSystem() {
        return this.batch.mode === BATCH_MODE_SYSTEM;
      },
      isReceive() {
        let mode = this.batch.mode;
        return mode === BATCH_MODE_BOT || BATCH_MODE_USER === mode;
      }
    }
  }
</script>

<style scoped>

</style>