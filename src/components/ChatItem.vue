<template>
    <v-list-item
        outlined
        @click="select"
    >
        <v-badge
            avatar
            dot
            :value="item.hasNew"
            color="error"
            offset-x="26"
            offset-y="20"
        >
            <v-list-item-avatar>
                <v-icon
                    class="red lighten-1 white--text"
                >{{item.icon}}</v-icon>
            </v-list-item-avatar>
        </v-badge>
        <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
            <v-list-item-subtitle >{{item.lastMessage}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
            <v-btn
                v-if="item.closable"
                @click.stop="close"
                icon
                color="#bbb" >X</v-btn>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
  import ChatInfo from '../protocals/ChatInfo';
  import {
    ACTION_CHAT_SELECT,
    ACTION_CHAT_CLOSE,
  } from '../constants';

  export default {
    name: "ChatItem",
    props : {
      item: {
        type : ChatInfo
      },
      selectable : {
        type : Boolean,
        default : true,
      }
    },
    methods : {
      select () {
        if (!this.selectable) {
            return;
        }
        this.$store.dispatch(
          ACTION_CHAT_SELECT,
          this.item
        );
      },
      close() {
        this.$store.dispatch(
          ACTION_CHAT_CLOSE,
          {sessionId: this.item.sessionId}
        )
      }
    }
  }
</script>

<style scoped>
</style>