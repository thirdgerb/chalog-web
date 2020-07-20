<template>
  <v-app>
    <!-- app bar -->
    <AppBar />
    <!-- loading -->
    <v-overlay :value="loading" opacity="0.1">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="isError">
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="error = ''"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
    <transition name="slide-fade">
          <router-view></router-view>
    </transition>
  </v-app>
</template>

<script>

import AppBar from './components/AppBar';
import {
  ACTION_USER_LOGOUT,
  ACTION_LOGIN_USER
} from "./constants";
import Cookies from 'js-cookie';
import User from './protocals/User';
import {getResponse} from "./utils";
import ErrorInfo from './socketio/ErrorInfo';
import Request from "./socketio/Request";
import Sign from "./socketio/Sign";


export default {
  name: 'App',

  components: {
    AppBar
  },
  data : () => ({
    error : '',
  }),
  created() {
    let id = Cookies.get('userid');
    let name = Cookies.get('username');
    let token = Cookies.get('token');

    if (id && name && token) {
      let user = new User({id, name, token});
      this.$store.dispatch(ACTION_LOGIN_USER, user);
      let proto = new Sign({name: user.name});
      this.$socket.emit('SIGN', new Request({token, proto}));
    }
  },
  sockets : {
    connect() {
      console.log('connected');
    },
    disconnect() {
      console.log('disconnect');
    },
    reconnect() {
      console.log('reconnect');
    },
    error() {
      console.log('error');
    },
    ERROR_INFO (res) {
      let $this = this;
      getResponse(res, function(proto) {
        let error = new ErrorInfo(proto);

        switch (error.errcode) {

          case 401 :
            this.$store.commit(ACTION_USER_LOGOUT);
            break;
          default :
            console.log(error);
        }
        $this.error = 'error:' + error.errcode + '; msg:' + error.errmsg;
        console.log($this.error);
        setTimeout(function() {
          $this.error = '';
        }, 10000);
      });
    },
  },
  computed:{
    loading () {
      return this.$store.state.layout.loading;
    },
    isError: {
      get() {
        return !! this.error;
      },
      set(val) {
        this.error = val || '';
      }

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
