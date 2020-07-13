import Vue from 'vue'
import Vuex from 'vuex'
import {
  TOGGLE_DRAWER,

  DRAWER_SETTER,
  LOADING_SETTER,

  VIDEO_PLAY_SETTER,
  PLAY_VIDEO,

  CHAT_TO_BOTTOM,
  CHAT_ALIVE_SETTER,
  CHAT_DELETE,
  CHAT_COMMIT_MESSAGE,

  ACTION_CHAT_SELECT,
  ACTION_CHAT_SUBSCRIBE,
  ACTION_CHAT_CLOSE,
  ACTION_CHAT_DISCONNECT,
} from '../constants';

// import Cookie from 'js-cookie';

import Menu from '../data/menu';
import NavItem from '../protocals/NavItem';
import ChatInfo from '../protocals/ChatInfo';
import TextMessage from "../protocals/TextMessage";
import MessageBatch from "../protocals/MessageBatch";

Vue.use(Vuex);

let userId = 'test';

// 初始化菜单.
let chats = {};
let alive;
for (let item of Menu) {
  if (item instanceof NavItem) {
    let chat = ChatInfo.fromNavItem(item, userId);
    if (alive) {
      chats[chat.sessionId] = chat;
    } else {
      alive = chat;
    }
  }
}

/**
 *
 * @param chats
 * @param {ChatInfo} insert
 */
function insertChat(chats, insert) {

  let chatsArr = Object.values(chats);
  chatsArr.unshift(insert);

  // 替换的元素排第一个.
  let newChats = {};
  for (let i of chatsArr) {
    newChats[i.sessionId] = i;
  }

  return newChats;
}

export default new Vuex.Store({
  state: {
    // 用户的信息
    user : {
      id : 'test',
      name : 'test',
    },
    // 页面呈现
    layout : {
      drawer: null,
      loading: false,
      chatToBottom : false,
    },
    // 视频模块
    video : {
      play : false,
      url : "//player.bilibili.com/player.html?aid=59609396&bvid=BV1Rt411g7t8&cid=103844486&page=1"
    },
    // 当前的会话
    alive: alive,
    // 进行中的聊天.
    chats : chats,
    // 消息
    incomingChats : [],
  },
  mutations: {
    /**
     * 开关抽屉.
     * @param state
     */
    [TOGGLE_DRAWER] : (state) => {
      let drawer = state.layout.drawer === null ? false : state.layout.drawer;
      state.layout.drawer = !drawer;
    },

    /**
     * 抽屉
     * @param state
     * @param val
     */
    [DRAWER_SETTER] : (state, val) => {
      state.layout.drawer = val;
    },

    /*------- loading -------*/
    [LOADING_SETTER] : (state, loading) => {
      state.layout.loading = loading;
    },

    /**
     * 播放电影.
     * @param state
     * @param  {string} payload
     */
    [PLAY_VIDEO] : (state, url = null) => {
      if (url !== null && url !== state.video.url) {
        state.video.url = url;
      }
      state.video.play = true;
    },

    /**
     * 开启或者关闭视频
     * @param state
     * @param val
     */
    [VIDEO_PLAY_SETTER] : (state, val) => {
      state.video.play = val;
    },

    /*---- chat ----*/

    /**
     * 滚动到底部
     * @param state
     * @param {bool} payload
     */
    [CHAT_TO_BOTTOM] : (state, payload) => {
        state.layout.chatToBottom = payload;
    },

    /**
     * @param state
     * @param chat
     */
    [CHAT_ALIVE_SETTER] : (state, chat) => {
      let alive = state.alive;
      if (chat.sessionId === alive.sessionId) {
        return;
      }

      delete state.chats[chat.sessionId];

      state.alive = chat;
      state.chats = insertChat(state.chats, alive);

      // 看看是否关闭 drawer
      state.layout.drawer = null;
      // 滚动屏幕.
      state.layout.chatToBottom = true;
    },

    /**
     * 提交消息
     */
    [CHAT_COMMIT_MESSAGE] : (state, {text}) => {

      let message = TextMessage.create(text);
      let batch = MessageBatch.createByMessage(
        message,
        state.user.name,
        state.user.id,
        true
      );

      // 插入一个 loading 的消息.
      batch.loading = true;

      // 插入新的消息.
      state.alive.appendBatch(batch);

      // 滚动到底部.
      state.layout.chatToBottom = true;
    },

    /**
     * 删除 Chat 的信息.
     * @param state
     * @param sessionId
     */
    [CHAT_DELETE] : (state, {sessionId}) => {
        delete state.chats[sessionId];
        state.menu.slice(sessionId, 1);
        if (sessionId === state.alive) {
          state.alive = state.menu[0];
        }
    }


  },
  actions: {

    /*------- chat 相关 -------*/

    /**
     * 选择当前的会话.
     * @param state
     * @param selected
     */
    [ACTION_CHAT_SELECT] : ({ commit}, chat) => {
      if (!(chat instanceof ChatInfo)) {
        throw new Error('select object should be ChatInfo');
      }

      commit(CHAT_ALIVE_SETTER, chat);

      // 模拟操作
      // dispatch(ACTION_CHAT_SUBSCRIBE);

      // 监听并且接受消息.
    },


    /**
     * 监听
     * @param commit
     */
    [ACTION_CHAT_SUBSCRIBE] ({commit}) {

      commit(LOADING_SETTER, true);

      setTimeout(function() {
        commit(LOADING_SETTER, false);
        commit(CHAT_TO_BOTTOM, true);
      }, 500);
    },

    /**
     * 关闭 chat
     *
     * @param dispatch
     * @param commit
     * @param state
     * @param sessionId
     */
    [ACTION_CHAT_CLOSE] ({dispatch, commit, state}, {sessionId}) {

      // 切换位点.
      dispatch(ACTION_CHAT_SELECT, {selected: state.alive});

      commit(CHAT_DELETE, {sessionId});

      dispatch(ACTION_CHAT_DISCONNECT, {sessionId});

    },

    /**
     * 断开 session 的连接.
     * @param store
     * @param sessionId
     */
    [ACTION_CHAT_DISCONNECT] (store, {sessionId}) {
      console.log(ACTION_CHAT_DISCONNECT, {sessionId});
    }
  },
  modules: {
  }
})
