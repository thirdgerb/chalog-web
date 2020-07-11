import Vue from 'vue'
import Vuex from 'vuex'
import {
  TOGGLE_DRAWER,
  TOGGLE_VIDEO,
  PLAY_VIDEO,
  CHAT_TO_BOTTOM,
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
      chatToBottom : false,
    },
    video : {
      play : false,
      url :
      "//player.bilibili.com/player.html?aid=838704523&bvid=BV1Bg4y1v79P&cid=207273372&page=1"
        //'//player.bilibili.com/player.html?aid=243815965&bvid=BV1iv411i7tq&cid=210478701&page=1',
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
        state.video.play = true;
        state.video.url = "//player.bilibili.com/player.html?aid=94527292&bvid=BV1nE411g7Lc&cid=161355478&page=1";
      },


    /**
     * 播放电影.
     * @param state
     * @param  {Object} payload
     */
    [PLAY_VIDEO] : (state, payload) => {
      console.log(
        'receive',
        payload,
        state.video.url,
        payload.url !== state.video.url
      );

        if (payload.url && payload.url !== state.video.url) {
          state.video.url = payload.url;
        }
        state.video.play = payload.play ? payload.play : false;
      },

      [CHAT_TO_BOTTOM] : (state, payload) => {
        if (Object.prototype.hasOwnProperty.call(payload, 'value')) {
          state.layout.chatToBottom = payload.value;
        }
      }
  },
  actions: {

  },
  modules: {
  }
})
