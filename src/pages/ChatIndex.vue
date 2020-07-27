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
                <h1>{{ description }}</h1>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
  import {intendTo} from "../utils";

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
          $this.$router.push($this.$store.getters.popNextRoute);
      }
    }
  }
</script>

<style scoped>

</style>