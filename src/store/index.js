import Vue from 'vue'
import Vuex from 'vuex'
import {
  TOGGLE_DRAWER,
  TOGGLE_VIDEO,
  VIDEO_SETTER
} from '../constants';
import Cookie from 'js-cookie';
import {chats,chat4, chat1} from '../data/demo';

Vue.use(Vuex)

let userId = Cookie.get('userId');
let userName = Cookie.get('userName');


let incoming = {};
incoming[chat4.sessionId] = chat4;



export default new Vuex.Store({
  state: {
    // 用户的信息
    user : {
      id : userId ? userId : 'test',
      name : userName ? userName : 'test',
    },
    // 页面呈现
    layout : {
      drawer: true,
      loading: false,
      alive: chat1.id,
    },
    video : {
      play : false,
      url : '//player.bilibili.com/player.html?aid=243815965&bvid=BV1iv411i7tq&cid=210478701&page=1',
    },
    // 进行中的聊天.
    chats : chats,
    // 消息
    incomingChats : incoming,
  },
  mutations: {
      [TOGGLE_DRAWER] : state => {
        state.layout.drawer = !state.layout.drawer;
      },
      [TOGGLE_VIDEO] : state => {
        state.video.play = !state.video.play;
      },
      [VIDEO_SETTER] : (state, val) => {
        state.video.play = val;
      }
  },
  actions: {
  },
  modules: {
  }
})
