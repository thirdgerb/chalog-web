import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import router from './router'
import VueSocketIO from 'vue-socket.io'
// import io from "socket.io-client"

const option = {
  transports: ["websocket"]
};
// const socket = io(process.env.VUE_APP_SOCKET_IO_CONNECTION, option);

Vue.use(new VueSocketIO({
    debug: process.env.VUE_APP_DEBUG,
    connection: process.env.VUE_APP_SOCKET_IO_CONNECTION,
    vuex: {
      store,
      actionPrefix: 'SOCKET_ACTION_',
      mutationPrefix: 'SOCKET_MUTATOR_'
    },
    options: option
  })
);

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app');
