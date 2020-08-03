
import Logger from 'js-logger';
import {
  USER_SETTER,
  USER_ACTION_LOGIN,
  USER_ACTION_LOGOUT,

  CHAT_INIT_MENU,

  EMITTER_ACTION_JOIN_ALL,
  EMITTER_ACTION_QUERY_CHATS,
  EMITTER_ACTION_LEAVE_ALL,
  EMITTER_ACTION_USER_LOGOUT,
  USER_RESET,
  STORE_ACTION_RESET_ALL
} from '../constants';

import Cookies from "js-cookie";

const cookieOption = {expires: 2, SameSite:'Strict'};

const reset = () => ({
  id : '',
  name : '',
  token : '',
});

export const user = {
  state: reset(),
  getters: {
    // 代表服务端已经发送了正确的 LOGIN 响应.
    isUserLogin: (state) => {
      return !!state.id;
    },
    token: (state) => {
      return state.token;
    }

  },
  mutations: {
    /**
     * 设置当前用户.
     */
    [USER_SETTER] (state, {id, name, token}) {
      state.id = id;
      state.name = name;
      state.token = token;
      Logger.debug("user_setter " + id);
    },

    [USER_RESET] (state) {
      Object.assign(state, reset());
    }
  },
  actions: {

    /**
     * 用户登录.
     * 初始化菜单.
     */
    async [USER_ACTION_LOGIN] ({commit, dispatch}, {id, name, token}) {
      if (!id || !name || !token) {
        Logger.error('invalid login info. id: ' + id + '; name:' + name + '; token:' + token );
        return;
      }

      // 同时设置 cookie. 相当于延长期限.
      Cookies.set('token', token, cookieOption);

      // 初始化菜单.
      await commit(CHAT_INIT_MENU, id);

      // 设置用户信息.
      await commit(USER_SETTER, {id, name, token});

      // 连接所有会话
      await dispatch(EMITTER_ACTION_JOIN_ALL, false);

      // 向服务端申请房间信息.
      dispatch(EMITTER_ACTION_QUERY_CHATS, {category:'', all:false});
    },

    /**
     * 用户退出.
     */
    async [USER_ACTION_LOGOUT] ({dispatch, rootState}) {

      // 提示 leave
      await dispatch(EMITTER_ACTION_LEAVE_ALL);
      await dispatch(EMITTER_ACTION_USER_LOGOUT);


      Cookies.remove('token');
      rootState.next = null;
      // 清空本地缓存.
      await localStorage.clear();

      dispatch(STORE_ACTION_RESET_ALL);
    },

  }
};