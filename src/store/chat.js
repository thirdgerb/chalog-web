import md5 from "js-md5";
import menu from '../data/menu';
import Logger from 'js-logger';

/**
 * 创建会话
 * @param title
 * @param scene
 * @param icon
 * @param session
 * @param closable
 * @param bot
 * @param userId
 * @returns {{title: string, scene: string, icon: string, session: string, closable: Boolean, bot: Boolean, context: {}, suggestions: {}, unread: int, updatedAt: number}}
 */
export function createConversation(
 {
   title,
   scene,
   icon,
   session,
   closable,
   bot,
 },
 userId,
) {

  bot = !!bot;
  title = title || scene;
  icon = icon || (bot ? 'mdi-robot' : 'mdi-forum');
  closable = !!closable;
  session = session || md5('scene:' + scene + ':user:' + userId);

  return {
    title,
    scene,
    icon,
    session,
    closable,
    bot,
    // 当前上下文状态
    context : {},
    // 建议选项.
    suggestions : {},
    // 是否有新消息
    unread : 0,
    // 最后更新时间
    updatedAt : 0,
    // 消息
    batches: [],
    // 最后消息
    lastMessage: '',
  }
}

/**
 * @param {Array} sessions
 * @param {string} session
 * @param {int} max
 */
export function insertSession(sessions, session, max = 100) {
  delete sessions[session];
  sessions.unshift(session);
  sessions.slice(0, max);
}

export const CHAT_SET_ALIVE = 'CHAT_SET_ALIVE';
export const CHAT_INIT_MENU = 'CHAT_INIT_MENU';
export const CHAT_INCOMING = 'CHAT_INCOMING';
export const CHAT_DELETE = 'CHAT_DELETE';
export const CHAT_COMMIT_MESSAGE = 'CHAT_COMMIT_MESSAGE';
export const CHAT_CHANGE_ALIVE_BOT = 'CHAT_CHANGE_ALIVE_BOT';

export const initChat = () => ({
  // 已连接的会话
  alive: null,
  connectedSessions: [],
  incomingSessions: [],
  connected: {},
  incoming: {},
});

export function pushNewBatchToChat(batch, chat, alive) {
  let batches = chat.batches;
  let session = batch.session;

  // 消息变更.
  batches.push(batch);
  chat.batches = batches.filter((i) => (i));
  chat.updatedAt = batch.createdAt;

  // unread 处理.
  if (batch.isNew && session !== alive) {
    chat.unread += 1;
  }
  chat.lastMessage = batch.lastMessage;
  return chat;
}

export function mergeOldBatchToChat(batch, chat) {
  let batches = chat.batches;
  for(let b of batches) {
    if (batch.batchId === b.batchId) {
      return;
    }
  }

  batches.push(batch);
  chat.batches = batches.sort((a, b) => {
    return a.createdAt - b.createdAt;
  });

  return chat;
}

export const chat = {
  state: () => {
    return initChat();
  },
  getters : {
    currentSessionRoute(state) {
      let session = state.connectedSessions[0] || '';
      return {name:'chat', params: {session} };
    },
    aliveChat(state) {
      let alive = state.alive;
      return state.connected[alive];
    }
  },

  mutations : {
    [CHAT_CHANGE_ALIVE_BOT] (state, bot) {
        let session = state.alive;
        state.connected[session].bot = bot;
    },

    /**
     * 初始化菜单.
     *
     * @param state
     * @param {string} userId
     */
    [CHAT_INIT_MENU] (state, userId) {

      if (menu.connected) {
        for(let o of menu.connected) {
          let con = createConversation(o, userId);
          let session = con.session;
          // 加入连接的会话.
          state.connected[session] = state.connected[session] || state.incoming[session] || con;
          delete state.incoming[session];

        }
      }

      if (menu.incoming) {
        for(let o of menu.incoming) {
          let con = createConversation(o, userId);
          let session = con.session;
          if (state.connected[session]) {
            break;
          }

          state.incoming[session] = state.incoming[session] || con;
        }
      }

      state.incomingSessions = Object.values(state.incoming)
        .sort((a, b) => a.updatedAt - b.updatedAt)
        .map((c) => c.session);

      state.connectedSessions = Object.values(state.connected)
        .sort((a, b) => a.updatedAt - b.updatedAt)
        .map((c) => c.session);
    },


    /**
     * 设置session 为当前session
     * @param state
     * @param {string} session
     */
    [CHAT_SET_ALIVE] (state, session) {

      if (session === state.alive) {
        return;
      }

      let con = state.connected[session];
      if (con) {
        state.alive = session;
        con.unread = 0;
        return;
      }

      con = state.incoming[session];
      if (con) {
        delete state.incoming[session];

        let i = state.incomingSessions.indexOf(session);
        state.incomingSessions.splice(i, 1);

        // 变更 con 所属位置.
        con.unread = 0;
        state.connected[session] = con;
        state.connectedSessions.unshift(session);
        state.alive = session;

        return;
      }

      Logger.warn('session ' + session + ' not exists');
    },

    [CHAT_INCOMING] (state, chat) {
      let session = chat.session;
      if (!session) {
        Logger.error('incoming chat is invalid', chat);
        return;
      }

      // 如果是已连接会话, 不做任何处理.
      let con = state.connected[session];
      if (con) {
        return;
      }

      // 未连接会话, 创建或标记红点.
      con = state.incoming[session] || createConversation(chat, null);
      con.unread = -1;  // 红点.

      // 插入
      insertSession(state.incoming, session);
    },

    [CHAT_DELETE] (state, session) {

      let con = state.connected[session];
      // 删除连接中对象.
      if (con) {
        delete state.connected[session];
        let i = state.connectedSessions.indexOf(session);
        state.connectedSessions.splice(i, 1);
        return;
      }

      con = state.incoming[session];
      if (con) {
        delete state.incoming[session];
        let i = state.incomingSessions.indexOf(session);
        state.connectedSessions.splice(i, 1);
        return;
      }

      Logger.warn('session ' + session + ' not exists')
    },

    [CHAT_COMMIT_MESSAGE] (state, batch) {
      if (!batch) {
        Logger.error(CHAT_COMMIT_MESSAGE + ' receive empty batch');
        return;
      }
      let session = batch.session;
      let chat = state.connected[session];
      if (!chat) {
        Logger.warn(CHAT_COMMIT_MESSAGE + ' but chat ' + session + ' not exists');
        return;
      }



      // 将 batch 的信息提交给 chat
      if (batch.createdAt > chat.updatedAt) {
        chat = pushNewBatchToChat(batch, chat, state.alive);
        // 变更会话顺序.
        let i = state.connectedSessions.indexOf(session);
        if (i >=0) {
          state.connectedSessions.splice(i, 1);
        }
        state.connectedSessions.unshift(session);

      } else {
        chat = mergeOldBatchToChat(batch, chat);
      }

      state.connected[session] = chat;
    }
  },
  actions : {

  }
};