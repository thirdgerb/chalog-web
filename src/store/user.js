import Cookies from 'js-cookie';
import {CHAT_INIT_MENU} from "./chat";
import Logger from 'js-logger';

const options = {expires: 2};

export const ACTION_USER_LOGOUT = 'ACTION_USER_LOGOUT';
export const ACTION_USER_LOGIN = 'ACTION_USER_LOGIN';
export const USER_SETTER = 'USER_SETTER';


export const user = {
  state: () => ({
    id : '',
    name : '',
    token : '',
  }),
  getters: {
    isUserLogin: (state) => {
      return state.id && state.name && state.token;
    },
    token: (state) => {
      return state.token;
    }

  },
  mutations: {
    [USER_SETTER] (state, {id, name, token}) {
      state.id = id;
      state.name = name;
      state.token = token;
      Logger.info("user_setter " + id);
    }

  },
  actions: {
    [ACTION_USER_LOGIN] ({commit}, {id, name, token}) {
      if (!id || !name || !token) {
        Logger.error('invalid login info. id: ' + id + '; name:' + name + '; token:' + token );
        return;
      }

      // 同时设置 cookie. 相当于延长期限.
      Cookies.set('userid', id, options);
      Cookies.set('username', name, options);
      Cookies.set('token', token, options);

      // 提交用户信息.
      commit(USER_SETTER, {id, name, token});
      // 初始化菜单.
      commit(CHAT_INIT_MENU, id);
    },

    [ACTION_USER_LOGOUT] ({commit}) {
      commit(USER_SETTER, {id:'', name:'', token:''});
      Cookies.remove('userid');
      Cookies.remove('username');
      Cookies.remove('token');
      // 通过reload 来重连.
      window.location.reload();
    }
  }
};