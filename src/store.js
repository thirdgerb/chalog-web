import Vue from 'vue'
import Vuex from 'vuex'

import {layout} from './store/layout';
import {user} from './store/user';
import {bili} from './store/bili';
import {chat} from './store/chat';
import {emitter} from './store/emitter';
import {socket} from "./store/socket";

Vue.use(Vuex);


export const store = new Vuex.Store({
  modules: {
    layout,
    user,
    bili,
    chat,
    emitter,
    socket,
  },
  state: {
    next: null,
  },
  getters: {
    onLoginRoute(state) {
      if (state.next) {
        return state.next;
      }
      let session = state.chat.alive;
      if (session) {
        return {name:'chat', params:{session}};
      }
      return {name:'chatIndex'};
    },
  },
  actions : {
  }
});
