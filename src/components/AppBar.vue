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
        <v-btn text small @click.stop="TOGGLE_VIDEO">视频</v-btn>

    </v-app-bar>
</template>

<script>
    import { mapMutations } from 'vuex'
    import { TOGGLE_DRAWER, TOGGLE_VIDEO } from "../constants";

    export default {
        name: "AppBar",
        computed: {

        },
        methods: {
            ...mapMutations([
              TOGGLE_DRAWER,
              TOGGLE_VIDEO,
            ]),
        }
    }
</script>

<style scoped>

</style>