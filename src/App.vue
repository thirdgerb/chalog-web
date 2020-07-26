<template>
  <v-app>
    <!-- app bar -->
    <AppBar />


    <!-- drawer -->
    <Drawer v-if="isLogin"/>
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

    <transition name="slide-fade">
      <keep-alive>
          <router-view></router-view>
      </keep-alive>
    </transition>

  </v-app>
</template>

<script>

import AppBar from './components/AppBar';
import Cookies from 'js-cookie';
import Drawer from './components/Drawer';
import AppMenu from './components/AppMenu';
import {EMITTER_ACTION_SIGN, USER_SETTER} from "./constants";


export default {
  name: 'App',

  components: {
    AppBar,
    Drawer,
    AppMenu
  },
  created() {
    let $this = this;

    let token = Cookies.get('token');

    // 通知服务端用户已登录. 理论上要根据用户身份加入默认的房间, 提供默认的信息.
    // 我现在很不喜欢弱类型不严谨的代码写法, 因为项目代码量太大了, 自己要看懂每一块很难.
    // js 应该也可以约束得更清楚, 但现在没有时间精力去爬坡了.
    if (token) {
      console.log('token', token);
      $this.$store.commit(USER_SETTER, {token});
      // 告知服务端.
      $this.$store.dispatch(EMITTER_ACTION_SIGN, {});
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
    /**
     * 观察登录信息.
     */
    isLogin(newVal, oldVal) {
      if (newVal === oldVal) {
        return;
      }

      let $this = this;

      // 登录了就跳入目标页面.
      if (newVal) {
        $this.$router.push($this.$store.getters.onLoginRoute);

      // 否则跳回首页.
      } else if($this.$route.name !== 'index') {
        $this.$router.replace({name:'index'});
      }
    },
    errorInfo(newVal) {
      this.error = !!newVal;
    }
  }
};
</script>

<style>
  @import "./assets/commune.css";

  .slide-fade-enter-active {
    transition: opacity 20s ease;
  }
  .slide-fade-leave-active {
    transition: opacity 20s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    opacity: 0;
  }
</style>
