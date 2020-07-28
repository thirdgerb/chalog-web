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
  import {popNextRoute} from "../utils";

  export default {
    name: "NotFound",
    methods : {
      goAlive() {
        let $this = this;
        let next = popNextRoute($this);
        return $this.$router.replace(next);
      }
    }
  }
</script>

<style scoped>

</style>