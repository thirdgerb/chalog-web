<template>
    <div class="chat-row"
         v-bind:class="{'chat-receive': !batch.isInput, 'chat-say':batch.isInput}"
    >
        <div class="chat-title" v-if="!batch.isInput">
            <span class="chat-author">{{ batch.creatorName }}</span>
            <span class="chat-date"> --:--:-- </span>
        </div>
        <template v-for="message in batch.messages">
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
</template>

<script>
  import MessageBatch from '../protocals/MessageBatch';
  import MessageBili from "./MessageBili";
  import MessageText from "./MessageText";
  import {MESSAGE_TEXT, MESSAGE_BILI} from "../constants";

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
    }
  }
</script>

<style scoped>

</style>