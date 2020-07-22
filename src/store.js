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
  // // 属性
  // state: {
  //   // 用户的信息
  //   user : null,
  //   // 页面呈现
  //   layout : {
  //     drawer: null,
  //     loading: false,
  //     chatToBottom : 0,
  //   },
  //   // next
  //   next : {name:'alive'},
  //   // 视频模块
  //   video : {
  //     play : false,
  //     resource : "//player.bilibili.com/player.html?aid=59609396&bvid=BV1Rt411g7t8&cid=103844486&page=1"
  //   },
  //   // 当前的会话
  //   menu : {
  //     alive: null,
  //     connected : {},
  //     list: {},
  //   },
  //   // 进行中的聊天.
  //   chats : {},
  // },
  // // getters
  // getters : {
  //   isLogin: state => !! state.user,
  //   token: state => state.user.token,
  // },
  //
  // //
  // mutations: {
  //   /**
  //    * 开关抽屉.
  //    * @param state
  //    */
  //   [TOGGLE_DRAWER] : (state) => {
  //     let drawer = state.layout.drawer === null ? false : state.layout.drawer;
  //     state.layout.drawer = !drawer;
  //   },
  //
  //   /**
  //    * 抽屉
  //    * @param state
  //    * @param val
  //    */
  //   [DRAWER_SETTER] : (state, val) => {
  //     state.layout.drawer = val;
  //   },
  //
  //   /*------- error -------*/
  //
  //   [SET_ERROR] : (state, {code, msg}) => {
  //     console.log('error code:' + code + '; msg:' + msg);
  //   },
  //
  //
  //   [INIT_MENU] : (state, {menu, user}) => {
  //     let id = user.id;
  //     let newMenu = {};
  //     let newChats = {};
  //     if (menu.alive) {
  //       let aliveNav = NavItem.from(menu.alive, id);
  //       newMenu.alive = aliveNav;
  //       insertChats(newChats, aliveNav);
  //     }
  //
  //     if (menu.connected) {
  //       newMenu.connected = createMenu(id, ...menu.connected);
  //       insertChats(newChats, ...Object.values(newMenu.connected));
  //     }
  //
  //     if (menu.list) {
  //       newMenu.list = createMenu(id, ...menu.list);
  //     }
  //
  //     state.menu = newMenu;
  //     state.chats = newChats;
  //   },
  //
  //
  //   /*------- loading -------*/
  //   [LOADING_SETTER] : (state, loading) => {
  //     state.layout.loading = loading;
  //   },
  //
  //   /**
  //    * 播放电影.
  //    * @param state
  //    * @param  {string} payload
  //    */
  //   [PLAY_VIDEO] : (state, resource = null) => {
  //     if (resource !== null && resource !== state.video.resource) {
  //       state.video.resource = resource;
  //     }
  //     state.video.play = true;
  //   },
  //
  //   /**
  //    * 开启或者关闭视频
  //    * @param state
  //    * @param val
  //    */
  //   [VIDEO_PLAY_SETTER] : (state, val) => {
  //     state.video.play = val;
  //   },
  //
  //   /*---- chat ----*/
  //
  //   /**
  //    * 滚动到底部
  //    * @param state
  //    * @param {int} payload
  //    */
  //   [CHAT_TO_BOTTOM] : (state, payload) => {
  //       state.layout.chatToBottom += payload;
  //   },
  //
  //   /**
  //    * @param state
  //    * @param {NavItem} nav
  //    */
  //   [CHAT_ALIVE_SETTER] : (state, selected) => {
  //
  //     let alive = state.menu.alive;
  //
  //     if (selected.session === alive.session) {
  //       return;
  //     }
  //
  //     // 初始化 Chats
  //     let chats = state.chats;
  //     let selectedChat = chats[selected.session];
  //     if (!selectedChat) {
  //       insertChats(chats, selected);
  //       selectedChat = chats[selected.session];
  //       state.chats = chats;
  //     }
  //
  //     // 删除未连接中的选项.
  //     delete state.menu.connected[selected.session];
  //     delete state.menu.list[selected.session];
  //
  //     selectedChat.hasNew = false;
  //     state.chats[alive.session].hasNew = false;
  //
  //     state.menu.alive = selected;
  //     state.menu.connected = insertMenu(state.menu.connected, alive);
  //
  //
  //     // 看看是否关闭 drawer
  //     state.layout.drawer = null;
  //     // 滚动屏幕.
  //     state.layout.chatToBottom += 1;
  //   },
  //
  //
  //   /**
  //    * 向 Chat 提交消息
  //    * @param state
  //    * @param {MessageBatch}batch
  //    */
  //   [CHAT_COMMIT_MESSAGE] : (state, batch) => {
  //     if (!batch) {
  //       throw new Error('batch should not be empty');
  //     }
  //     let chats = state.chats;
  //     let session = batch.session;
  //     let chat = chats[session];
  //
  //     if (!chat) {
  //       console.log(session + ' not exists');
  //       return;
  //     }
  //     console.log(chat);
  //
  //     // 插入新的消息.
  //     chat.appendBatch(batch);
  //     chat.hasNew = batch.isNew()
  //       && (state.menu.alive.session !== session);
  //
  //     // 如果有提议
  //     let suggestions = batch.suggestions;
  //     if (suggestions) {
  //       chat.suggestions = suggestions;
  //       chat.isSaid = false;
  //     }
  //
  //     chats[chat.session] = chat;
  //     state.chats = chats;
  //
  //     // 如果是当前会话, 则滑动到底部.
  //     let aliveSession = state.menu.alive.session;
  //     if (aliveSession === chat.session) {
  //       state.layout.chatToBottom += 1;
  //     }
  //   },
  //
  //   /**
  //    * 删除 Chat 的信息.
  //    * @param state
  //    * @param {NavItem} nav
  //    */
  //   [CHAT_DELETE] : (state, nav) => {
  //
  //     let session = nav.session;
  //
  //     // 正是当前的对象.
  //     if (state.menu.alive.session === session) {
  //
  //       let connected = Object.keys(state.menu.connected)[0];
  //
  //       state.menu.alive = state.menu.connected[connected];
  //       state.layout.chatToBottom += 1;
  //       delete state.menu.connected[connected];
  //       return;
  //     }
  //
  //     delete state.menu.connected[session];
  //     delete state.menu.list[session];
  //   },
  //
  //
  //   /**
  //    * @param state
  //    * @param {User} user
  //    */
  //   [USER_SETTER] (state, user) {
  //
  //     if (user) {
  //       let option = {expires :7};
  //       Cookies.set('userid', user.id, option);
  //       Cookies.set('username', user.name, option);
  //       Cookies.set('token', user.token || '', option);
  //       state.user = user;
  //     } else {
  //       Cookies.remove('userid');
  //       Cookies.remove('username');
  //       Cookies.remove('token');
  //       state.user = null;
  //     }
  //
  //   },
  //
  //   /*------- socket -------*/
  //
  //
  // },
  // actions: {
  //
  //   /*------- chat 相关 -------*/
  //
  //   /**
  //    * 选择当前的会话.
  //    * @param state
  //    * @param {NavItem} nav
  //    */
  //   [ACTION_CHAT_CONNECT] : ({state, commit}, nav) => {
  //     if (!(nav instanceof NavItem)) {
  //       throw new Error('select object should be NavItem');
  //     }
  //
  //     // 初始化chat.
  //     let session = nav.session;
  //     let chat = state.chats[session];
  //     if (!chat) {
  //       chat = new ChatInfo({
  //         scene: nav.scene,
  //         session
  //       });
  //       state.chats[session] = chat;
  //     }
  //
  //     // 模拟操作
  //     // dispatch(ACTION_CHAT_SUBSCRIBE);
  //
  //     // 监听并且接受消息.
  //     commit(CHAT_ALIVE_SETTER, nav);
  //   },
  //
  //   /**
  //    * 监听
  //    * @param commit
  //    */
  //   [ACTION_CHAT_SUBSCRIBE] ({commit}) {
  //
  //     commit(LOADING_SETTER, true);
  //
  //     setTimeout(function() {
  //       commit(LOADING_SETTER, false);
  //       commit(CHAT_TO_BOTTOM, true);
  //     }, 500);
  //   },
  //
  //   /**
  //    * 关闭 chat
  //    *
  //    * @param dispatch
  //    * @param commit
  //    * @param state
  //    * @param sessionId
  //    */
  //   [ACTION_CHAT_CLOSE] ({dispatch, commit, state}, {sessionId}) {
  //
  //     // 切换位点.
  //     dispatch(ACTION_CHAT_CONNECT, {selected: state.alive});
  //
  //     commit(CHAT_DELETE, {sessionId});
  //
  //     dispatch(ACTION_CHAT_DISCONNECT, {sessionId});
  //
  //   },
  //
  //   /**
  //    * 断开 session 的连接.
  //    * @param store
  //    * @param sessionId
  //    */
  //   [ACTION_CHAT_DISCONNECT] (store, {sessionId}) {
  //     console.log(ACTION_CHAT_DISCONNECT, {sessionId});
  //   },
  //
  //   [ACTION_LOGIN_USER] (store, user) {
  //     let option = {expires: 7};
  //
  //     // 保存 cookie
  //     Cookies.set('userid', user.id, option);
  //     Cookies.set('username', user.name, option);
  //     Cookies.set('token', user.token, option);
  //
  //     store.commit(USER_SETTER, user);
  //     store.commit(INIT_MENU, {menu, user});
  //   },
  //
  //   [ACTION_USER_LOGOUT] (store) {
  //
  //     store.state.menu = {alive: null, connected:{}, list:{}};
  //     store.chats = {};
  //     store.commit(USER_SETTER, null);
  //   },
  //
  //   /*---------- socket.io ----------*/
  //
  //   /**
  //    * 登录用户, 并且创建菜单, 连接会话.
  //    */
  //   SOCKET_ACTION_LOGIN ({dispatch}, res) {
  //     getResponse(res, function(proto) {
  //       let user = new User(proto);
  //       dispatch(ACTION_LOGIN_USER, user);
  //     });
  //   },
  //
  //
  // },

})
