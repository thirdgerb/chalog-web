import Vue from 'vue'
import Vuex from 'vuex'

import {layout} from './store/layout';
import {user} from './store/user';
import {bili} from './store/bili';
import {chat} from './store/chat';

Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    layout,
    user,
    bili,
    chat
  },
})
