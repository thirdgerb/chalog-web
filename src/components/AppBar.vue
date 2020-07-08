<template>
    <!-- app bar -->
    <v-app-bar
        app
        color="indigo"
        dark
        dense
        flat
        abusolute
    >
        <v-app-bar-nav-icon @click.stop="TOGGLE_DRAWER"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-toolbar-title>CommuneChatbot</v-toolbar-title>
    </v-app-bar>
</template>

<script>
    import { mapMutations } from 'vuex'
    import { TOGGLE_DRAWER } from "../constants";

    export default {
        name: "AppBar",
        computed: {

        },
        methods: {
            ...mapMutations([
              TOGGLE_DRAWER
            ]),
        }
    }
</script>

<style scoped>

</style>