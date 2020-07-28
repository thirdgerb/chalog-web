<template>
    <v-main app >
        <v-container
            class="fill-height commune-index"
            fluid
            @click="goAlive()"
        >
            <v-row
                    align="center"
                    justify="center"
            >
                <h3>{{ description }}</h3>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
  import {intendTo, popNextRoute} from "../utils";

  export default {
    name: "ChatIndex",
    computed: {
      description () {
        return this.$store.state.socket.connecting ? '点击进入会话' : '连接服务器中...' ;
      },
    },
    mounted() {
      let $this = this;
      if (!$this.$store.getters.isUserLogin) {
        intendTo($this);
      }
    },
    methods: {
      goAlive() {
          let $this = this;
          let next = popNextRoute($this);
          $this.$router.push(next);
      }
    }
  }
</script>

<style scoped>

</style>