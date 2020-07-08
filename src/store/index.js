import Vue from 'vue'
import Vuex from 'vuex'
import {TOGGLE_DRAWER} from '../constants';
import Cookie from 'js-cookie';

import {Chat} from '../data/protocals';

Vue.use(Vuex)

var userId = Cookie.get('userId');
var userName = Cookie.get('userName');

export default new Vuex.Store({
  state: {
    // 用户的信息
    user : {
      id : userId ? userId : '',
      name : userName ? userName : '',
    },
    // 页面呈现
    layout : {
      drawer: true,
      loading: false,
    },
    // 聊天.
    chats : [
      new Chat({
        // 对话的场景, 决定机器人响应的对象.
        scene : '',
        // 对话指定的 SessionId. 如果不指定, 服务端应该生成一个.
        sessionId : '',
        //
        title : '会话的标题',
        // 会话的图标, 没有的话应该用默认的.
        icon : 'mdi-robot',
        // 会话的简介. 鼠标悬停的时候应该呈现.
        desc : '',
        // 是否有未读的新消息.
        hasNew : true,
        //
        lastMessage : '最后一条消息',
        //
        receivedAt : '1 min'
      }),
      new Chat({
        // 对话的场景, 决定机器人响应的对象.
        scene : '',
        // 对话指定的 SessionId. 如果不指定, 服务端应该生成一个.
        sessionId : '',
        //
        title : '测试会话2',
        // 会话的图标, 没有的话应该用默认的.
        icon : 'mdi-robot',
        // 会话的简介. 鼠标悬停的时候应该呈现.
        desc : '',
        // 是否有未读的新消息.
        hasNew : true,
        //
        lastMessage : '最后一条消息',
        //
        receivedAt : '1 min'
      }),

    ],
    // 消息

  },
  mutations: {
      [TOGGLE_DRAWER] : state => {
          state.layout.drawer = !state.layout.drawer;
      }
  },
  actions: {
  },
  modules: {
  }
})
