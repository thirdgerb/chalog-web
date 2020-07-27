
import Logger from 'js-logger';
import {
  USER_SETTER,
  USER_ACTION_LOGIN,
  USER_ACTION_LOGOUT,

  CHAT_INIT_MENU,

  EMITTER_ACTION_JOIN_ALL,
  EMITTER_ACTION_QUERY_CHATS, EMITTER_ACTION_LEAVE_ALL
} from '../constants';

import Cookies from "js-cookie";

export const cookieOption = {expires: 2};

export const user = {
  state: () => ({
    id : '',
    name : '',
    token : '',
  }),
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
      await dispatch(EMITTER_ACTION_JOIN_ALL);

      // 向服务端申请房间信息.
      dispatch(EMITTER_ACTION_QUERY_CHATS, {category:'', all:false});
    },

    /**
     * 用户退出.
     * @param commit
     * @param dispatch
     */
    async [USER_ACTION_LOGOUT] ({commit, dispatch}) {

      // 提示 leave
      await dispatch(EMITTER_ACTION_LEAVE_ALL);

      commit(USER_SETTER, {id:'', name:'', token:''});

      Cookies.remove('token');

      // 清空本地缓存.
      await localStorage.clear();

      // 重进入页面.
      window.location.reload();
    },

  }
};