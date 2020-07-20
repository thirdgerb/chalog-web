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
  ACTION_CHAT_DELIVER_MESSAGE,


  SET_ERROR,
  INIT_MENU,

  ACTION_LOGIN_USER

  /* socket */
  // SOCKET_ACTION_MESSAGE
} from './constants';

import Cookies from 'js-cookie';

import ChatInfo from './protocals/ChatInfo';
import MessageBatch from "./protocals/MessageBatch";

import NavItem from './protocals/NavItem';
// import TextMessage from "./protocals/TextMessage";
// import BiliMessage from "./protocals/BiliMessage";
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
    isLogin: state => !! state.user
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


    [INIT_MENU] : (state, {alive, connected, list}) => {
      let id = state.user.id;
      if (alive) {
        let aliveNav = NavItem.from(alive, id);
        state.menu.alive = aliveNav;
        insertChats(state.chats, aliveNav);
      }

      if (connected) {
        state.menu.connected = createMenu(id, ...connected);
        insertChats(state.chats, state.menu.connected);
      }
      if (list) {
        state.menu.list = createMenu(id, ...list);
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
     * @param {NavItem} chat
     */
    [CHAT_ALIVE_SETTER] : (state, chat) => {

      let alive = state.menu.alive;

      if (chat.session === alive.session) {
        return;
      }

      // 删除未连接中的选项.
      delete state.menu.connected[chat.session];
      delete state.menu.list[chat.session];

      chat.hasNew = false;
      alive.hasNew = false;

      state.menu.alive = chat;
      state.menu.connected = insertMenu(state.menu.connected, alive);


      // 看看是否关闭 drawer
      state.layout.drawer = null;
      // 滚动屏幕.
      state.layout.chatToBottom += 1;
    },


    /**
     * 用户提交消息
     *
     * @param state
     * @param {MessageBatch} batch
     */
    [CHAT_COMMIT_MESSAGE] : (state, {chat, batch, suggestions}) => {
      if (!batch) {
        throw new Error('batch should not be empty');
      }

      // 插入新的消息.
      chat.appendBatch(batch);
      chat.hasNew = !batch.isInput
        && (state.menu.alive.session !== chat.session);

      // 如果有提议
      if (suggestions) {
        chat.suggestions = suggestions;
        chat.isSaid = false;
      }

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
      let option = {expires :7};
      Cookies.set('userid', user.id, option);
      Cookies.set('username', user.name, option);
      Cookies.set('token', user.token || '', option);

      state.user = user;
    }


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
     * 主动发送消息.
     *
     */
    [ACTION_CHAT_DELIVER_MESSAGE] ({commit, state}, message) {

      let session = state.menu.alive.session;
      let chat = state.chats[session];
      if (!chat) {
        throw new Error('chat not exists');
      }

      // 先提交消息, 然后再发送消息.
      let batch = MessageBatch.createByMessage(
        message,
        state.user.name,
        true
      );

      // 标记 chat 已经输入
      chat.isSaid = true;

      // 插入一个 loading 的消息.
      batch.loading = true;
      commit(CHAT_COMMIT_MESSAGE, {chat, batch});

      // 模型响应中动作.
      chat.loading = true;
      setTimeout(function() {
        chat.loading = false;
        // let newBatch = MessageBatch.createByMessage(
        //   TextMessage.create('hello world!'),
        //   'test',
        //   false
        // );
        // newBatch.appendMessage(BiliMessage.fake());
        // let suggestions = ['张三', '李四', '王五'];
        // try {
        //   commit(CHAT_COMMIT_MESSAGE, {chat, batch:newBatch, suggestions });
        // }finally {
        // }
      }, 1000);

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
      store.commit(INIT_MENU, menu);
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
