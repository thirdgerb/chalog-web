
import {v4} from 'uuid';
import Logger from "js-logger";
import Input from "../socketio/Input";
import {Message} from "../socketio/Message";
import {
  EMITTER_ACTION_REQUEST,
  EMITTER_ACTION_SIGN,
  EMITTER_ACTION_REGISTER,

  EMITTER_ACTION_JOIN,
  EMITTER_ACTION_JOIN_ALL,
  EMITTER_ACTION_LEAVE,
  EMITTER_ACTION_LEAVE_ALL,

  EMITTER_ACTION_DELIVER_MESSAGE,
  EMITTER_ACTION_QUERY_MESSAGES,

  EMITTER_ACTION_QUERY_CHATS,
  EMITTER_ACTION_QUERY_SCENE,

  EMITTER_ACTION_MANUAL, EMITTER_ACTION_USER_LOGOUT,

} from '../constants';
import {BATCH_MODE_SYSTEM} from "../socketio/MessageBatch";


export class Request {
  trace;
  token;
  proto;

  constructor({trace, token, proto}) {
    this.trace = trace || v4();
    this.token = token;
    // 是否要校验 proto
    this.proto = proto;
  }
}

export const emitter = {

  state : () =>({
  }),
  
  actions : {

    /**
     * 发送请求.
     */
    [EMITTER_ACTION_REQUEST] ({rootState}, [event, proto, trace]) {
      let token = rootState.user.token;
      let request = new Request({trace, proto, token});
      // Logger.debug('emit ' + event + ':' + JSON.stringify(request));
      window.socket.emit(event, request);
    },

    /**
     * 发送登录通知.
     */
    [EMITTER_ACTION_SIGN] ({dispatch}, {name, password}) {
      dispatch(EMITTER_ACTION_REQUEST, ['SIGN', {name, password}]);
    },


    /**
     * 注册
     */
    [EMITTER_ACTION_REGISTER] ({dispatch}, {name, password}) {
      dispatch(EMITTER_ACTION_REQUEST, ['REGISTER', {name, password}]);
    },

    /**
     * 加入房间.
     */
    [EMITTER_ACTION_JOIN] ({dispatch}, {scene, session}) {
      dispatch(EMITTER_ACTION_REQUEST, ['JOIN', {scene, session}])
    },

    /**
     * 退出房间.
     */
    [EMITTER_ACTION_LEAVE] ({dispatch}, {scene, session}) {
      dispatch(EMITTER_ACTION_REQUEST, ['LEAVE', {scene, session}]);
    },

    /**
     * 加入所有已连接的房间.
     * @param dispatch
     * @param rootState
     */
    [EMITTER_ACTION_JOIN_ALL] ({dispatch, rootState}) {
      let rooms = Object.values(rootState.chat.connected)
        .map(({scene, session}) => ({scene, session}));

      for (let room of rooms) {
        dispatch(EMITTER_ACTION_JOIN, room);
      }
    },

    /**
     * 退出所有房间. 通常是退出登录的行为.
     * @param dispatch
     * @param rootState
     */
    [EMITTER_ACTION_LEAVE_ALL] ({dispatch, rootState}) {
      let rooms = Object.values(rootState.chat.connected)
        .map(({scene, session}) => ({scene, session}));

      for (let room of rooms) {
        dispatch(EMITTER_ACTION_LEAVE, room);
      }
    },

    /**
     * 发送消息到服务端.
     */
    [EMITTER_ACTION_DELIVER_MESSAGE] ({dispatch, rootState}, {message, session}) {
      if (!(message instanceof Message)) {
        Logger.error('message must be instance of Message');
        return;
      }

      // 准备参数.
      let chat = rootState.chat.connected[session];
      if (!chat) {
        Logger.error('chat ' + session + ' not connected');
        return;
      }

      // 封装参数.
      let input = new Input(
        {session , bot : chat.bot, scene: chat.scene},
        message
      );

      dispatch(EMITTER_ACTION_REQUEST, ['INPUT', input, message.id]);
    },

    /**
     * 请求一个会话的新老消息
     */
    [EMITTER_ACTION_QUERY_MESSAGES] (
      {dispatch, rootState},
      {session, forward, limit}
    ) {

      if (!session) {
        Logger.error('session ' + session + ' not exists');
        return;
      }

      forward = !!forward;
      limit = limit || 5;

      // 会话没有连接. 不请求消息.
      let con = rootState.chat.connected[session];
      if (!con) {
        return;
      }

      let scene = con.scene;
      // 如果已经标记了没有更老的消息
      if (!forward && !con.hasElderMessages) {
        Logger.warn('session ' + session + ' has no more elder messages');
        return;
      }

      // 确认游标.
      let vernier = null;

      if (forward && con.batches.length > 0) {
        let max= con.batches.length;
        for (let i = max -1 ; i >= 0 ; i--) {
          let batch = con.batches[i];
          if (batch.mode !== BATCH_MODE_SYSTEM) {
            vernier = batch.batchId;
            break;
          }
        }

      } else if (!forward && con.batches.length > 0) {
        let max= con.batches.length;
        for (let i = 0 ; i < max ; i++) {
          let batch = con.batches[i];
          if (batch.mode !== BATCH_MODE_SYSTEM) {
            vernier = batch.batchId;
            break;
          }
        }
      }

      dispatch(
        EMITTER_ACTION_REQUEST,
        ['QUERY_MESSAGES', {scene, session, vernier, forward, limit}]
      );
    },

    /**
     * @param dispatch
     * @param category
     * @param all       当 all 为空, 只要求服务端主动推荐, 用户无法挑选的房间.
     */
    [EMITTER_ACTION_QUERY_CHATS] ({dispatch}, {category, all}) {
      category = category || '';
      all = !!all;

      dispatch(EMITTER_ACTION_REQUEST, ['QUERY_CHATS', {category, all}]);
    },

    /**
     * 请求场景的详细信息.
     * @param dispatch
     * @param scene
     */
    [EMITTER_ACTION_QUERY_SCENE] ({dispatch}, {scene}) {
      dispatch(EMITTER_ACTION_REQUEST, ['QUERY_SCENE', {scene}]);
    },

    /**
     * 转人工通知.
     */
    [EMITTER_ACTION_MANUAL] ({dispatch}, {scene, session}) {
      dispatch(EMITTER_ACTION_REQUEST, ['MANUAL', {scene, session}]);
    },

    [EMITTER_ACTION_USER_LOGOUT] ({dispatch}) {
      dispatch(EMITTER_ACTION_REQUEST, ['USER_LOGOUT', {}]);
    }
  }
};