<template>
  <v-app>
    <!-- app bar -->
    <AppBar />
    <!-- loading -->
    <v-overlay :value="loading" opacity="0.1">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <transition name="fade">
      <keep-alive>
          <router-view></router-view>
      </keep-alive>
    </transition>
  </v-app>
</template>

<script>

import AppBar from './components/AppBar';
// import {CHAT_BOTTOM, CHAT_TO_BOTTOM} from "./constants";


export default {
  name: 'App',

  components: {
    AppBar
  },
  data : () => ({

  }),
  computed:{
    loading () {
      return this.$store.state.layout.loading;
    },

    // 用户是否已经登录.
    login () {
        return this.$store.getters.isLogin;
    },

  },


};
</script>

<style>

</style>
