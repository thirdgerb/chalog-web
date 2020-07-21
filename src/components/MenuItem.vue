<template>
    <v-list-item
        outlined
        @click.stop="$emit('select-chat', item)"
        :disabled="isAlive"
    >
        <v-badge
            avatar
            dot
            :value="hasNew"
            color="error"
            offset-x="26"
            offset-y="20"
        >
            <v-list-item-avatar class="purple lighten-1">
                <v-icon dark>{{item.icon}}</v-icon>
            </v-list-item-avatar>
        </v-badge>
        <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
            <v-list-item-subtitle style="color:grey">{{lastMessage}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
            <v-btn
                v-if="item.closable"
                icon
                color="#bbb"
                @click.stop="close"
            >X</v-btn>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
  import NavItem from '../protocals/NavItem';

  // import {
  //   ACTION_CHAT_CONNECT,
  //   ACTION_CHAT_CLOSE,
  // } from '../constants';

  export default {
    name: "ChatItem",
    props : {
      item: NavItem,
      isAlive : {
        type : Boolean,
        default : false,
      },
    },
    computed: {
      lastMessage () {
        let $this = this;
        let chats = $this.$store.state.chats;
        let session = $this.item.session;

        let chat = chats[session];
        return chat ? chat.lastMessage : '';
      },
      hasNew() {
        let $this = this;
        let chat = $this.$store.state.chats[$this.item.session];
        return (!!chat && chat.hasNew);
      }
    },
    methods : {
      close() {
        this.$emit('close-chat')
      },
    },
  }
</script>

<style scoped>
</style>