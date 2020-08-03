<template>
  <v-app>
    <!-- app bar -->
    <AppBar />


    <!-- drawer -->
    <AppMenu v-if="isLogin"/>
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

    <router-view></router-view>

  </v-app>
</template>

<script>

import AppBar from './components/AppBar';
import Cookies from 'js-cookie';
import AppMenu from './components/AppMenu';
import {EMITTER_ACTION_SIGN, USER_SETTER} from "./constants";
import {intendTo} from "./utils";


export default {
  name: 'App',

  components: {
    AppBar,
    AppMenu
  },
  created() {
    let $this = this;

    let token = Cookies.get('token');

    // 通知服务端用户已登录. 理论上要根据用户身份加入默认的房间, 提供默认的信息.
    // 我现在很不喜欢弱类型不严谨的代码写法, 因为项目代码量太大了, 自己要看懂每一块很难.
    // js 应该也可以约束得更清楚, 但现在没有时间精力去爬坡了.
    if (token) {
      $this.$store.commit(USER_SETTER, {token});
      // 告知服务端.
      $this.$store.dispatch(EMITTER_ACTION_SIGN, {});
    }

    // 用比较脏的方式传递配置...
    if (window.markedOption) {
      window.marked.setOptions(window.markedOption)
    }
  },
  data: () =>({
    error:false,
  }),
  computed:{
    loading () {
      return this.$store.state.layout.loading;
    },
    errorInfo() {
      return this.$store.state.layout.error;
    },
    isLogin() {
      return this.$store.state.user.id;
    }
  },
  watch : {
    errorInfo(newVal) {
      if (newVal) {
        this.error = true;
      }
    },

  },
  sockets: {

    ERROR_INFO (res) {
      let code = res.proto ? res.proto['errcode'] : null;
      let $this = this;
      switch (code) {
        case 401 :
          if ($this.$route.name !== 'index') {
            intendTo($this, {name:'index'});
          }
      }
      $this.error = true;
    },

  },
};
</script>

<style>
  @import "./assets/commune.css";
</style>
