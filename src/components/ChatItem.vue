<template>

    <v-list-item outlined
     :value="session"
     :to="to"
    >
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

  import {CHAT_ACTION_CLOSE} from "../constants";

  export default {
    name: "ChatItem",
    props : ['session', 'connected', 'chat'],
    methods: {
      closeItem() {
        let $this = this;
        let session = $this.session;
        $this.$store.dispatch(CHAT_ACTION_CLOSE, session);
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