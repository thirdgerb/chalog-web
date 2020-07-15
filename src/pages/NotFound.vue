<template>
    <v-main app >
        <v-container
            class="fill-height commune-index"
            fluid
            @click="goAlive"
        >
            <v-row
                align="center"
                justify="center"
            >
                <h1>404 Page Not Found</h1>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
  export default {
    name: "NotFound",
    mounted () {
      let $this = this;
      setTimeout(function() {
        $this.goAlive();
      }, 2000);
    },
    methods : {
      goAlive() {
        let $this = this;

        if ($this.$store.getters.isLogin) {
          return $this.$router.replace({name : 'alive'});
        } else {
          return $this.$router.replace({name : 'login'});
        }
      }
    }
  }
</script>

<style scoped>

</style>