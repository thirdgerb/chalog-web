import Vue from 'vue'
import Vuex from 'vuex'
import {
  TOGGLE_DRAWER,

  DRAWER_SETTER,
  LOADING_SETTER,

  VIDEO_PLAY_SETTER,
  PLAY_VIDEO,

  USER_SETTER,

  CHAT_TO_BOTTOM,
  CHAT_ALIVE_SETTER,
  CHAT_DELETE,
  CHAT_COMMIT_MESSAGE,

  ACTION_CHAT_CONNECT,
  ACTION_CHAT_SUBSCRIBE,
  ACTION_CHAT_CLOSE,
  ACTION_CHAT_DISCONNECT,

  SET_ERROR,
  INIT_MENU,

  ACTION_LOGIN_USER,
  ACTION_USER_LOGOUT,

  /* socket */
  // SOCKET_ACTION_MESSAGE
} from './constants';

import Cookies from 'js-cookie';

import ChatInfo from './protocals/ChatInfo';
import NavItem from './protocals/NavItem';
// import TextMessage from "./protocals/TextMessage";
// import BiliMessage from "./protocals/BiliMessage";
// import ErrorInfo from "./socketio/ErrorInfo";
import User from "./protocals/User";
import menu from "./data/menu";
import {insertChats, insertMenu, getResponse, createMenu} from "./utils";

Vue.use(Vuex);


export default new Vuex.Store({
  // 属性
  state: {
    // 用户的信息
    user : null,
    // 页面呈现
    layout : {
      drawer: null,
      loading: false,
      chatToBottom : 0,
    },
    // next
    next : {name:'alive'},
    // 视频模块
    video : {
      play : false,
      url : "//player.bilibili.com/player.html?aid=59609396&bvid=BV1Rt411g7t8&cid=103844486&page=1"
    },
    // 当前的会话
    menu : {
      alive : null,
      connected : [],
      list: [],
    },
    // 进行中的聊天.
    chats : {},
  },
  // getters
  getters : {
    isLogin: state => !! state.user,
    token: state => state.user.token,
  },

  //
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

    /*------- error -------*/

    [SET_ERROR] : (state, {code, msg}) => {
      console.log('error code:' + code + '; msg:' + msg);
    },


    [INIT_MENU] : (state, {menu, user}) => {
      let id = user.id;
      if (menu.alive) {
        let aliveNav = NavItem.from(menu.alive, id);
        state.menu.alive = aliveNav;
        insertChats(state.chats, aliveNav);
      }

      if (menu.connected) {
        state.menu.connected = createMenu(id, ...menu.connected);
        insertChats(state.chats, ...Object.values(state.menu.connected));
      }

      if (menu.list) {
        state.menu.list = createMenu(id, ...menu.list);
      }
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
     * @param {int} payload
     */
    [CHAT_TO_BOTTOM] : (state, payload) => {
        state.layout.chatToBottom += payload;
    },

    /**
     * @param state
     * @param {NavItem} nav
     */
    [CHAT_ALIVE_SETTER] : (state, nav) => {

      let alive = state.menu.alive;

      if (nav.session === alive.session) {
        return;
      }

      // 初始化 Chats
      let chat = state.chats[nav.session];
      if (!chat) {
        insertChats(state.chats, nav);
      }

      // 删除未连接中的选项.
      delete state.menu.connected[nav.session];
      delete state.menu.list[nav.session];

      nav.hasNew = false;
      alive.hasNew = false;

      state.menu.alive = nav;
      state.menu.connected = insertMenu(state.menu.connected, alive);


      // 看看是否关闭 drawer
      state.layout.drawer = null;
      // 滚动屏幕.
      state.layout.chatToBottom += 1;
    },


    /**
     * 向 Chat 提交消息
     * @param state
     * @param {MessageBatch}batch
     */
    [CHAT_COMMIT_MESSAGE] : (state, {session, batch}) => {
      if (!batch) {
        throw new Error('batch should not be empty');
      }
      let chat = state.chats[session];

      // 插入新的消息.
      chat.appendBatch(batch);
      chat.hasNew = !batch.mode
        && (state.menu.alive.session !== chat.session);

      // 如果有提议
      let suggestions = batch.suggestions;
      if (suggestions) {
        chat.suggestions = suggestions;
        chat.isSaid = false;
      }

      state.chats[chat.session] = chat;

      // 如果是当前会话, 则滑动到底部.
      let aliveSession = state.menu.alive.session;
      if (aliveSession === chat.session) {
        state.layout.chatToBottom += 1;
      }
    },

    /**
     * 删除 Chat 的信息.
     * @param state
     * @param {NavItem} nav
     */
    [CHAT_DELETE] : (state, nav) => {

      let session = nav.session;

      // 正是当前的对象.
      if (state.menu.alive.session === session) {

        let connected = Object.keys(state.menu.connected)[0];

        state.menu.alive = state.menu.connected[connected];
        state.layout.chatToBottom += 1;
        delete state.menu.connected[connected];
        return;
      }

      delete state.menu.connected[session];
      delete state.menu.list[session];
    },


    /**
     * @param state
     * @param {User} user
     */
    [USER_SETTER] (state, user) {

      if (user) {
        let option = {expires :7};
        Cookies.set('userid', user.id, option);
        Cookies.set('username', user.name, option);
        Cookies.set('token', user.token || '', option);
      } else {
        Cookies.remove('userid');
        Cookies.remove('username');
        Cookies.remove('token');
      }

      state.user = user;
    },

    /*------- socket -------*/


  },
  actions: {

    /*------- chat 相关 -------*/

    /**
     * 选择当前的会话.
     * @param state
     * @param {NavItem} nav
     */
    [ACTION_CHAT_CONNECT] : ({state, commit}, nav) => {
      if (!(nav instanceof NavItem)) {
        throw new Error('select object should be NavItem');
      }

      // 初始化chat.
      let session = nav.session;
      let chat = state.chats[session];
      if (!chat) {
        chat = new ChatInfo({
          scene: nav.scene,
          session
        });
        state.chats[session] = chat;
      }

      // 模拟操作
      // dispatch(ACTION_CHAT_SUBSCRIBE);

      // 监听并且接受消息.
      commit(CHAT_ALIVE_SETTER, nav);
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
      dispatch(ACTION_CHAT_CONNECT, {selected: state.alive});

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
    },

    [ACTION_LOGIN_USER] (store, user) {
      let option = {expires: 7};

      // 保存 cookie
      Cookies.set('userid', user.id, option);
      Cookies.set('username', user.name, option);
      Cookies.set('token', user.token, option);

      store.commit(USER_SETTER, user);
      store.commit(INIT_MENU, {menu, user});
    },

    [ACTION_USER_LOGOUT] (store) {

      store.state.menu = {alive: null, connected:{}, list:{}};
      store.chats = {};
      store.commit(USER_SETTER, null);
    },

    /*---------- socket.io ----------*/

    /**
     * 登录用户, 并且创建菜单, 连接会话.
     */
    SOCKET_ACTION_LOGIN ({dispatch}, res) {
      getResponse(res, function(proto) {
        let user = new User(proto);
        dispatch(ACTION_LOGIN_USER, user);
      });
    },


  },
  modules: {
  }
})
