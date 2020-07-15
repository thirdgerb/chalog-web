<template>
  <v-app>
    <!-- app bar -->
    <AppBar />
    <!-- loading -->
    <v-overlay :value="loading" opacity="0.1">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!--<transition name="slide-fade">-->
      <keep-alive>
          <router-view></router-view>
      </keep-alive>
    <!--</transition>-->
  </v-app>
</template>

<script>

import AppBar from './components/AppBar';
import Cookies from 'js-cookie';
import User from './protocals/User';
import {ACTION_LOGIN_USER} from "./constants";


export default {
  name: 'App',

  components: {
    AppBar
  },
  data : () => ({

  }),
  created() {
    // 登录用户.
    let userId = Cookies.get('userid');
    let username = Cookies.get('username');
    let token = Cookies.get('token');
    let $this = this;

    if ( userId && username) {
      let user = new User({id:userId, name:username, token: token});
      $this.$store.dispatch(ACTION_LOGIN_USER, user);
    }
  },
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
  @import "./assets/commune.css";

  /*.slide-fade-enter-active {*/
    /*transition: opacity 20s ease;*/
  /*}*/
  /*.slide-fade-leave-active {*/
    /*transition: opacity 20s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
  /*}*/
  /*.slide-fade-enter, .slide-fade-leave-to*/
    /*!* .slide-fade-leave-active for below version 2.1.8 *! {*/
    /*opacity: 0;*/
  /*}*/
</style>
