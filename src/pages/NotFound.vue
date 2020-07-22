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
    methods : {
      goAlive() {
        let $this = this;
        return $this.$router.replace({name : 'index'});
      }
    }
  }
</script>

<style scoped>

</style>