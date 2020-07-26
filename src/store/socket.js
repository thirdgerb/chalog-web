
import Logger from "js-logger";
import {
  USER_ACTION_LOGIN,
  USER_ACTION_LOGOUT,

  CHAT_COMMIT_MESSAGE,
  CHAT_ACTION_MESSAGES_MERGE,
  CHAT_ACTION_INFO_MERGE,

  LAYOUT_SNACK_BAR_TOGGLE,

  EMITTER_ACTION_JOIN_ALL, CHAT_DELETE, EMITTER_ACTION_QUERY_MESSAGES,
} from "../constants";
import {BATCH_MODE_SELF, MessageBatch} from "../socketio/MessageBatch";

export class Response {

  event;
  trace;
  proto;

  constructor(event, {trace, proto}) {
    this.event = event;
    this.trace = trace;
    this.proto = proto;
    Logger.trace(this);
  }

}

export function getResponse(event, res, caller) {

  let response = new Response(event, res);
  Logger.debug('getResponse', response);
  caller(response.proto);
}


export const socket = {

  state : () => ({
    connecting: false,

  }),
  mutations : {
    SOCKET_MUTATOR_connect(state) {
      state.connecting = true;
    },


    SOCKET_MUTATOR_disconnect(state) {
      state.connecting = false;
    },
  },

  actions : {

    SOCKET_ACTION_error({commit}, error) {
      commit(LAYOUT_SNACK_BAR_TOGGLE, error);
    },

    SOCKET_ACTION_reconnect({rootState, dispatch}) {
      // 弹出通知.
      // 用户未登录.
      if (!rootState.user.id) {
        return;
      }

      // 重连所有的会话.
      if (rootState.user.id) {
        dispatch(EMITTER_ACTION_JOIN_ALL);
      }

    },

    /*----- 非系统事件. ------*/

    /**
     * 用户登录确认事件.
     * 接下来触发一系列操作.
     */
   SOCKET_ACTION_USER_LOGIN({dispatch}, res) {
     getResponse('USER_LOGIN', res, function({id, name, token}) {
       dispatch(USER_ACTION_LOGIN, {id, name, token});
     });
    },

    /**
     * 异常信息的通知.
     */
    SOCKET_ACTION_ERROR_INFO({commit, dispatch}, res) {
      getResponse('ERROR_INFO', res, function({errcode, errmsg}) {
        // 用 snack bar 提示异常.
        commit(
          LAYOUT_SNACK_BAR_TOGGLE,
          'error:' + errmsg + ' code:' + errcode
        );

        // 对异常码的专门处理.
        switch (errcode) {
          // 退出登录.
          case 401 :
            dispatch(USER_ACTION_LOGOUT);
            break;
          default :
        }
      });

    },

    /**
     * 连接到后, 立刻查询最新的消息以做合并.
     */
    SOCKET_ACTION_JOIND_ROOM({dispatch}, res) {
      getResponse('JOINED_ROOM', res, function({session}) {
        dispatch(EMITTER_ACTION_QUERY_MESSAGES, {session, forward: true, limit:10});
      });
    },

    /**
     * 服务端下发房间信息.
     */
    SOCKET_ACTION_USER_CHATS({dispatch}, res) {
      getResponse('USER_CHATS', res, function({ chats }){
        for (let c of chats) {
          dispatch(CHAT_ACTION_INFO_MERGE, c);
        }
      });
    },

    SOCKET_ACTION_CHAT_DELETE({commit}, res) {
      getResponse('CHAT_DELETE', res, function({session, reason}){
        commit(CHAT_DELETE, {session, reason});
      });
    },

    /**
     * 收到一条消息
     */
    SOCKET_ACTION_MESSAGE_BATCH({rootState, commit}, res) {
      let userId = rootState.user.id;
      getResponse('MESSAGE_BATCH', res, function(proto) {
        let batch = new MessageBatch(proto);

        if (batch.creatorId === userId) {
          batch.mode = BATCH_MODE_SELF;
        }

        commit(
          CHAT_COMMIT_MESSAGE,
          batch
        );

      });
    },

    /**
     * 收到一批消息
     */
    SOCKET_ACTION_MESSAGES_MERGE({rootState, dispatch}, res) {
      getResponse('MESSAGES_MERGE', res, function({ session, limit, batches, forward }) {

        let count = batches.length;
        let chat = rootState.chat.connected[session];

        if (!chat || !count) {
          return;
        }

        let userId = rootState.user.id;

        // 类型化.
        batches = batches.map((c) => {
          let b = new MessageBatch(c);

          if (b.creatorId === userId) {
            b.mode = BATCH_MODE_SELF;
          }

          return b;
        });

        dispatch(
          CHAT_ACTION_MESSAGES_MERGE,
          {userId, session, limit, batches, forward}
        );

      })
    },

    /**
     * 服务器告知要删除会话.
     */
    SOCKET_ACTION_QUIT_CHAT ({commit}, res) {
      getResponse('QUIT_CHAT', res, function({session, reason}) {
        commit(CHAT_DELETE, {session, reason});
      });
    }
  }
};