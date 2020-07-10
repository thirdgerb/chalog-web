import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from './components/Login';
import ShowChat from './components/ShowChat';
import NotFound from './components/NotFound';

Vue.use(VueRouter);

const router = new VueRouter({
  routes : [
    {
      path: '/',
      name: 'index',
      redirect: '/chat/test',
    },
    // 登录页.
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // 会话页.
    {
      path: '/chat/:sessionId',
      name: 'chat',
      component: ShowChat
    },
    //
    {path: '*', component: NotFound}
  ]

});

export default router;