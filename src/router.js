import Vue from 'vue';
import VueRouter from 'vue-router';

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ChatPage from './pages/ChatPage';
import ChatIndex from './pages/ChatIndex';
import ScenePage from './pages/ScenePage';

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
      path: '/scene/:scene',
      name: 'scene',
      component: ScenePage,
      props: (r) => ({scene:r.params.scene}),
    },
    {
      path: '/chat',
      name: 'chatIndex',
      component: ChatIndex,
    },
    {
      path: '/chat/:session',
      name: 'chat',
      component: ChatPage,
      props: (r) => ({aliveSession:r.params.session}),
    },
    // 404 未找到.
    {path: '/404', component: NotFound},
    {path: '*', component: NotFound},
  ],

});

export default router;