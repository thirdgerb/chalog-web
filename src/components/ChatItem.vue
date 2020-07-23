<template>

    <v-list-item outlined :value="session" :to="to">
        <v-badge
        :dot="dot"
        :value="chat.unread !==0 "
        :content="getUnread()"
        color="error"
        :offset-x="offsetX"
        :offset-y="offsetY"
        >

            <v-list-item-avatar
                class="lighten-2"
                :class="{'purple':!isAlive, 'green':isAlive}"
            >
                <v-icon dark>{{chat.icon}}</v-icon>
            </v-list-item-avatar>
        </v-badge>
        <v-list-item-content>
            <v-list-item-title>{{chat.title}}</v-list-item-title>
            <v-list-item-subtitle style="color:grey">{{chat.lastMessage}}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
            <v-btn
                v-if="chat.closable"
                icon
                color="#bbb"
                @click.stop.prevent="closeItem"
            >X</v-btn>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
  // import {getLastMessage} from '../store/chat';

  import Room from "../socketio/Room";
  import Request from "../socketio/Request";

  export default {
    name: "ChatItem",
    props : {
      session: String,
      connected: Boolean,
    },
    methods: {
      closeItem() {
        let $this = this;
        let session = $this.session;

        if ($this.connected) {
          let chat = $this.$store.state.chat.connected[session];
          let room = new Room(chat);
          let request = new Request({proto:room, token:$this.$store.getters.token});
          $this.$socket.emit('LEAVE', request);
        }

        // 删除当前会话的话, 要准备好替代的.
        let chatData = $this.$store.state.chat;
        if (session === chatData.alive) {
          let next = chatData.connectedSessions[0];
          next = next !== session ? next : chatData.connectedSessions[1];
          $this.$router.push({name:'chat', params:{session:next}});
        }

        $this.$emit('close-chat', $this.session);
      },
      getUnread() {
        let $this = this;
        let session = $this.session;
        let chat;
        if ($this.connected) {
          chat = $this.$store.state.chat.connected[session];
        } else {
          chat = $this.$store.state.chat.incoming[session];
        }

        return chat.unread > 9 ? '..' : chat.unread;
      },
    },
    computed: {
      chat () {
        let $this = this;
        let session = $this.session;
        if ($this.connected) {
          return $this.$store.state.chat.connected[session];
        } else {
          return $this.$store.state.chat.incoming[session];
        }
      },
      to () {
        let session = this.session;
        return {name:'chat', params:{session}}
      },
      isAlive () {
        let $this = this;
        return $this.session === $this.$store.state.chat.alive;
      },

      dot () {
        return this.chat.unread < 0;
      },
      offsetX() {
        return this.dot ? 25 : 28;
      },
      offsetY() {
        return this.dot ? 20 : 25;
      },
    },
  }
</script>

<style scoped>
</style>