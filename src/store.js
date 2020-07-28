import Vue from 'vue'
import Vuex from 'vuex'

import {layout} from './store/layout';
import {user} from './store/user';
import {bili} from './store/bili';
import {chat} from './store/chat';
import {emitter} from './store/emitter';
import {socket} from "./store/socket";
import {BILI_RESET, CHAT_RESET, STORE_ACTION_RESET_ALL, USER_RESET} from "./constants";

Vue.use(Vuex);

const reset = () => ({
  next : {
    name: 'scene',
    params: {
      scene: 'commune',
    }
  }
});


export const store = new Vuex.Store({
  modules: {
    layout,
    user,
    bili,
    chat,
    emitter,
    socket,
  },
  state: reset(),
  actions : {

    [STORE_ACTION_RESET_ALL] ({state, commit}) {
      Object.assign(state, reset());
      commit(USER_RESET);
      commit(CHAT_RESET);
      commit(BILI_RESET);
    }
  }
});
