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
    // 登录页.
    {
      path: '/login',
      name: 'login',
      component: Index,
      props : {login:true}
    },
    {
      path: '/alive',
      name: 'alive',
      component: ChatPage,
    },
    // 会话页, 如果会话不存在, 可以主动生成一个会话.
    // 这个可以作为链接分享出去.
    {
      path: '/chat/:scene/id/:session',
      name: 'chat',
      component: ChatPage
    },
    // 404 未找到.
    {path: '*', component: NotFound}
  ]

});

export default router;