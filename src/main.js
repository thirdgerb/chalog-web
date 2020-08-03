import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import {store} from './store'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import io from "socket.io-client"
import Logger from 'js-logger';

Logger.useDefaults();

const DEBUG = "true" === process.env.VUE_APP_DEBUG;
let level = DEBUG ? Logger.DEBUG : Logger.WARN;
Logger.setLevel(level);


const option = {
  transports: ["websocket"]
};
const socket = io(process.env.VUE_APP_SOCKET_IO_CONNECTION, option);
window.socket = socket;

Vue.use(new VueSocketIO({
    debug: DEBUG,
    connection: socket,
    vuex: {
      store,
      actionPrefix: 'SOCKET_ACTION_',
      mutationPrefix: 'SOCKET_MUTATOR_'
    },
  })
);

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app');
