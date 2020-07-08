<template>
  <v-app>
    <!-- app bar -->
    <AppBar/>

    <!-- drawer -->
    <Drawer/>

    <!-- loading -->
    <v-overlay :value="loading" opacity="0.1">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-main>
      <ShowChat></ShowChat>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar';
import Drawer from './components/Drawer';
import ShowChat from './components/ShowChat';


export default {
  name: 'App',

  components: {
      Drawer,
      ShowChat,
      AppBar,
  },

  data: () => ({
    //
  }),
  computed:{

      loading () {
        return this.$store.state.layout.loading;
      }
  }
};
</script>
