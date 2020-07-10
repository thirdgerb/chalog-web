<template>
    <v-list-item outlined>

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
                    class="blue white--text"
                >{{item.icon}}</v-icon>
            </v-list-item-avatar>
        </v-badge>


        <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
            <v-list-item-subtitle >{{lastMessage}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
            <v-btn icon color="#bbb" >X</v-btn>
        </v-list-item-action>
    </v-list-item>
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