import Vue from 'vue';
import VueRouter from 'vue-router';

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ChatPage from './pages/ChatPage';

Vue.use(VueRouter);

const router = new VueRouter({
  routes : [
    // 首页. 如果用户已经登录, 跳转到会话页.
    // 否则跳转到登录页.
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: '/chat/:session',
      name: 'chat',
      component: ChatPage,
    },
    // 404 未找到.
    {path: '/404', component: NotFound},
    {path: '*', component: NotFound},
  ]

});

export default router;