<template>
    <v-main app >
        <v-container
            class="fill-height commune-index"
            fluid
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
  export default {
    name: "ChatIndex",
    computed: {
      description () {
        return this.$store.state.socket.connecting ? '服务器已连接' : '连接服务器中...' ;
      },
    },
  }
</script>

<style scoped>

</style>