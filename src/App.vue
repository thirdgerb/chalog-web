<template>
  <v-app>
    <!-- app bar -->
    <AppBar />
    <!-- loading -->
    <v-overlay :value="loading" opacity="0.1">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-snackbar v-model="error">
      {{ errorInfo }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="error = !error"
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
import {getResponse} from "./utils";
import ErrorInfo from './socketio/ErrorInfo';
import Request from "./socketio/Request";
import Sign from "./socketio/Sign";
import {ACTION_USER_LOGOUT, ACTION_USER_LOGIN} from "./store/user";
import Login from './socketio/Login';
import Cookies from 'js-cookie';
import Logger from 'js-logger';
import {LAYOUT_SNACK_BAR_TOGGLE} from "./store/layout";


export default {
  name: 'App',

  components: {
    AppBar
  },
  created() {
    let $this = this;

    let id = Cookies.get('userid');
    let name = Cookies.get('username');
    let token = Cookies.get('token');
    let isLogin = id && name && token;

    // 通知服务端用户已登录. 理论上要根据用户身份加入默认的房间, 提供默认的信息.
    // 我现在很不喜欢弱类型不严谨的代码写法, 因为项目代码量太大了, 自己要看懂每一块很难.
    // js 应该也可以约束得更清楚, 但现在没有时间精力去爬坡了.
    if (isLogin) {
        // 登录用户
        $this.$store.dispatch(ACTION_USER_LOGIN, {id, name, token});
        // 告知服务端.
        let proto = new Sign({name:name});
        $this.$socket.emit('SIGN', new Request({token, proto}));
    }
  },
  data: () =>({
    error:false,
  }),
  sockets : {
    connect() {
      Logger.debug('connected');
    },
    disconnect() {
      Logger.debug('disconnect');
    },
    reconnect() {
      Logger.debug('reconnect');
    },
    error() {
      Logger.debug('error');
    },

    // 服务端传来登录信息
    LOGIN(res) {
      let $this = this;
      getResponse(res, function(proto) {
        let login = new Login(proto);

        $this.$store.dispatch(ACTION_USER_LOGIN, {
          id: login.id,
          name: login.name,
          token: login.token
        });
      });
    },

    // 监听服务端全局的异常信息.
    ERROR_INFO (res) {
      let $this = this;
      getResponse(res, function(proto) {
        let error = new ErrorInfo(proto);

        // 对异常码的专门处理.
        switch (error.errcode) {
          // 退出登录.
          case 401 :
            $this.$store.dispatch(ACTION_USER_LOGOUT);
            if ($this.$route.name !== 'index') {
              $this.$router.push({name:'index'});
            }
            break;
          default :
        }

        // 用 snack bar 提示异常.
        $this.error = true;
        $this.$store.commit(
          LAYOUT_SNACK_BAR_TOGGLE,
          'error:' + error.errcode + '; msg:' + error.errmsg
        );
      });
    },
  },
  computed:{
    loading () {
      return this.$store.state.layout.loading;
    },
    errorInfo() {
      return this.$store.state.layout.error;
    },
  },
  watch : {
    errorInfo(newVal) {
      this.error = !!newVal;
    }
  }
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
