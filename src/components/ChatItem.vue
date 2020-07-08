<template>
    <div>
        <v-list-item
        >
            <v-list-item-avatar>
                <v-icon
                    class="blue white--text"
                >{{item.icon}}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
                <v-list-item-subtitle >{{lastMessage}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action >
                <v-badge color="pink" dot avatar>
                    <v-list-item-action-text v-text="item.receivedAt"></v-list-item-action-text>
                </v-badge>
            </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
    </div>
</template>

<script>
  import {Chat} from '../data/protocals';

  export default {
    name: "ChatItem",
    props : {
      item: Chat
    },
    computed : {
      lastMessage () {
        let item =this.item;
        return item.lastMessage.slice(0, 8);
      }
    }
  }
</script>

<style scoped>

</style>