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

  ACTION_CHAT_CONNECT,
  ACTION_CHAT_SUBSCRIBE,
  ACTION_CHAT_CLOSE,
  ACTION_CHAT_DISCONNECT,
  ACTION_CHAT_DELIVER_MESSAGE,
} from '../constants';

// import Cookie from 'js-cookie';

import ChatInfo from '../protocals/ChatInfo';
import MessageBatch from "../protocals/MessageBatch";

import User from '../protocals/User';
import NavItem from '../protocals/NavItem';
import TextMessage from "../protocals/TextMessage";

Vue.use(Vuex);

// 初始化用户.
let user = new User({});
let userId = user.id;



/*------ 初始化菜单. ------*/

// alive
let to_commune = NavItem.from({
    title: 'Commune助手',
    scene: 'commune',
    icon: 'mdi-robot',
    closable: false
  },
  userId
);

// 交流群
let to_group = NavItem.from({
    title: '交流群',
    scene: 'commune-chat',
    icon: 'mdi-forum',
    session: 'commune-chat',
    closable: false
  },
  userId
);


// 与作者私聊.
let to_author = NavItem.from({
    title: '联系作者',
    scene: 'thirdgerb',
    icon: 'mdi-account-question',
    closable: true
  },
  userId
);

/*--------- 定义方法 ----------*/

function insertChat(chats, chat) {
  let chatArr = Object.values(chats);
  chatArr.unshift(chat);

  let newChats = {};
  for (let item of chatArr) {
    newChats[item.session] = item;
  }

  return newChats;
}

/*--------- 初始化会话 ----------*/

let chats = {};
let group_chat = new ChatInfo(to_group);
group_chat.suggestions = ['张三', '李四', '王五'];
let commune_chat = new ChatInfo(to_commune);

chats[group_chat.session] = group_chat;
chats[commune_chat.session] = commune_chat;

function createMenu(...items) {
  let menu = {};
  let item;
  for (item of items) {
    menu[item.session] = item;
  }
  return menu;
}




export default new Vuex.Store({
  state: {
    // 用户的信息
    user : user,
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
    menu : {
      alive : to_commune,
      connected : createMenu(to_group),
      list: createMenu(to_author),
    },
    // 进行中的聊天.
    chats : chats,
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
      state.menu.connected = insertChat(state.menu.connected, alive);


      // 看看是否关闭 drawer
      state.layout.drawer = null;
      // 滚动屏幕.
      state.layout.chatToBottom = true;
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

      // 如果有提议
      if (suggestions) {
        chat.suggestions = suggestions;
        chat.isSaid = false;
      }

      // 如果是当前会话, 则滑动到底部.
      let aliveSession = state.menu.alive.session;
      if (aliveSession === chat.session) {
        state.layout.chatToBottom = true;
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
        delete state.menu.connected[connected];
        return;
      }

      delete state.menu.connected[session];
      delete state.menu.list[session];
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
        state.user.id,
        true
      );

      // 标记 chat 已经输入
      chat.isSaid = true;

      // 插入一个 loading 的消息.
      batch.loading = true;
      commit(CHAT_COMMIT_MESSAGE, {chat, batch});

      // 发送消息到服务端的逻辑.
      // 模拟一个回复逻辑
      chat.loading = true;

      setTimeout(function() {

        let newBatch = MessageBatch.createByMessage(
          TextMessage.create('hello world!'),
          'test',
          'test',
          false
        );
        let suggestions = ['张三', '李四', '王五'];
        try {
          commit(CHAT_COMMIT_MESSAGE, {chat, batch:newBatch, suggestions });
        }finally {
          chat.loading = false;
        }

      }, 1500);

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
    }
  },
  modules: {
  }
})
