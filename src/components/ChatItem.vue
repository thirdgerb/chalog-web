<template>
    <v-tooltip right>
    <template v-slot:activator="{ on, attrs }">
    <v-list-item outlined
     :value="session"
     :to="to" v-bind="attrs" v-on="on"
    >
        <v-badge
        :dot="!connected"
        :value="unread"
        :content="unread"
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
            <v-list-item-subtitle style="color:grey">{{lastMessage}}</v-list-item-subtitle>
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
        <span>{{chat.title}}</span>
    </v-tooltip>
</template>

<script>

  import {CHAT_ACTION_CLOSE} from "../constants";
  import {popNextRoute} from "../utils";

  export default {
    name: "ChatItem",
    props : ['session', 'connected', 'chat', 'alive', 'unread', 'lastMessage'],
    methods: {
      closeItem() {
        let $this = this;
        let session = $this.session;

        $this.$store.dispatch(CHAT_ACTION_CLOSE, {session});
        setTimeout(function() {
            let next = popNextRoute($this);
            $this.$router.push(next);
        }, 100);
      },
    },
    computed: {
      content () {
        let unread = this.unread;
        return unread > 9 ? '..' : unread;
      },
      to () {
        let session = this.session;
        return {name:'chat', params:{session}}
      },
      isAlive () {
        let $this = this;
        return $this.session === $this.alive;
      },
      offsetX() {
        return !this.connected ? 25 : 28;
      },
      offsetY() {
        return !this.connected ? 20 : 25;
      },
    },
  }
</script>

<style scoped>
</style>