import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
// import router from './router'
import VueScroller from 'vue-scroller';

Vue.use(VueScroller);

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
