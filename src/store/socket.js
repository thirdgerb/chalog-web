
import Logger from "js-logger";
import {
  USER_ACTION_LOGIN,

  CHAT_COMMIT_MESSAGE,
  CHAT_ACTION_MESSAGES_MERGE,
  CHAT_ACTION_INFO_MERGE,
  CHAT_CACHE_CONNECTED,

  LAYOUT_SNACK_BAR_TOGGLE,

  EMITTER_ACTION_JOIN_ALL,
  CHAT_DELETE,
  EMITTER_ACTION_QUERY_MESSAGES,
} from "../constants";
import {BATCH_MODE_SELF, BATCH_MODE_SYSTEM, MessageBatch} from "../socketio/MessageBatch";
import {TextMessage} from "../socketio/Message";

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
  // Logger.debug('get response ' + event + ':' + JSON.stringify(response));
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
        dispatch(EMITTER_ACTION_JOIN_ALL, true);
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
    SOCKET_ACTION_ERROR_INFO({commit}, res) {
      getResponse('ERROR_INFO', res, function({errcode, errmsg}) {
        // 用 snack bar 提示异常.
        commit(
          LAYOUT_SNACK_BAR_TOGGLE,
          'error:' + errmsg + ' code:' + errcode
        );
      });

    },

    /**
     * 连接到后, 立刻查询最新的消息以做合并.
     */
    SOCKET_ACTION_JOINED_ROOM({dispatch, commit, rootState}, res) {
      getResponse('JOINED_ROOM', res, async function({session}) {
        await dispatch(EMITTER_ACTION_QUERY_MESSAGES, {session, forward: true, limit:5});

        let message = TextMessage.create("- 连接到会话 -");
        let batch = MessageBatch.createByMessage(
          session,
          message,
          rootState.user,
          BATCH_MODE_SYSTEM
        );
        commit(CHAT_COMMIT_MESSAGE, batch);
      });
    },

    /**
     * 服务端下发房间信息.
     */
    SOCKET_ACTION_USER_CHATS({dispatch, commit, rootState}, res) {
      getResponse('USER_CHATS', res, async function({ chats, init }){
        chats = Object.values(chats).reverse();

        for (let c of chats) {
          await dispatch(CHAT_ACTION_INFO_MERGE, c);
        }

        commit(CHAT_CACHE_CONNECTED);

        if (init) {
          rootState.chat.init = true;
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
        let userId = rootState.user.id;
        if (!userId ) {
          Logger.warn('invalid CHAT_ACTION_MESSAGES_MERGE user not exists ' + userId);
          return;
        }

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