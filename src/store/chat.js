import md5 from "js-md5";
import Logger from 'js-logger';

import {
  CHAT_DELETE,
  CHAT_COMMIT_MESSAGE,
  CHAT_ACTION_CONNECT_INCOMING,
  CHAT_TOGGLE_MANUAL,
  CHAT_INIT_MENU,
  CHAT_RESET_UNREAD,
  CHAT_CACHE_CONNECTED,

  CHAT_ACTION_MESSAGES_MERGE,
  CHAT_ADD_INFO,
  CHAT_ACTION_INFO_MERGE,
  EMITTER_ACTION_JOIN,
  CHAT_MERGE_MESSAGES,
  EMITTER_ACTION_QUERY_MESSAGES,
  CHAT_ACTION_TOGGLE_MANUAL,
  LAYOUT_SNACK_BAR_TOGGLE,
  EMITTER_ACTION_MANUAL,
  CHAT_ACTION_CLOSE,
  EMITTER_ACTION_LEAVE,
  CHAT_RESET,

} from '../constants';
import {
  BATCH_MODE_BOT,
  BATCH_MODE_SELF,
  BATCH_MODE_SYSTEM,
  MessageBatch
} from "../socketio/MessageBatch";

let localStorageKey = null;

/**
 * 创建会话
 */
export function createConversation(
 {
   title,
   scene,
   icon,
   session,
   closable,
   autoJoin,
   bot,
 },
 userId,
) {
  title = title || scene;
  if (!icon) {
    icon = bot ? 'mdi-robot' : 'mdi-forum';
  }
  closable = !!closable;
  session = session || md5('scene:' + scene + ':user:' + userId);
  autoJoin = !!autoJoin;

  return {
    title,
    scene,
    icon,
    session,
    closable,
    autoJoin,
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
    count: 0,
    hasElderMessages: true,
    said : true,
  }
}

export function saveConnectedToStorage(connected, storageKey) {

  if (!storageKey) {
    Logger.error('try to save storage without valid key');
    return;
  }

  let save = [];
  for (let key of Object.keys(connected)) {
    let chat = connected[key];
    save.push({
      title: chat.title,
      scene: chat.scene,
      icon: chat.icon,
      session: chat.session,
      closable : chat.closable,
      bot: chat.bot,
      context : {},
      suggestions : {},
      updatedAt : chat.updatedAt,
      batches: [],
      unread: 0,
      // lastMessage: chat.lastMessage,
      hasElderMessages: true,
      said : true
    });
  }
  localStorage.setItem(storageKey, JSON.stringify(save));
}

/**
 * @param {Array} sessions
 * @param {string} session
 * @param {int} max
 * @return Array
 */
export function insertSession(sessions, session, max = 100) {
  let i = sessions.indexOf(session);
  if (i >= 0) {
    sessions.splice(i, 1);
  }
  sessions.unshift(session);
  sessions.slice(0, max);
  return sessions;
}

/**
 * 将一匹消息合并到当前会话.
 */
export function mergeBatches(chat, batches) {
  if (!batches) {
    return chat;
  }

  let map = {};
  for (let b of chat.batches) {
    map[b.batchId] = b;
  }

  for (let b of batches) {
    map[b.batchId] = b;
  }

  chat.batches = Object.values(map)
    .filter((v) => !!v)
    .sort((a, b) => a.createdAt - b.createdAt);

  return chat;
}

export function getUnread(batch) {
  return batch.messages.length;
}


export function countUnread(state) {
  let connectedArr = Object.values(state.connected);
  let unread = 0;
  for(let c of connectedArr) {
    unread = unread + c.unread;
  }

  for (let c of Object.values(state.incoming)) {
    unread += c.unread;
  }
  return unread;
}

export function pushNewBatchToChat(batch, chat) {
  // 消息变更.
  chat.batches.push(batch);
  chat.count = chat.batches.length;

  if (batch.mode !== BATCH_MODE_SYSTEM) {
    chat.lastMessage = batch.lastMessage;
    chat.unread += getUnread(batch);
  }

  if (batch.mode !== BATCH_MODE_SELF) {
    chat.updatedAt = batch.createdAt;
  }

  let isBot = batch.mode === BATCH_MODE_BOT;
  if (isBot && Object.keys(batch.suggestions).length > 0) {
    chat.suggestions = batch.suggestions;
    chat.said = false;
  }

  if (isBot && Object.keys(batch.context).length > 0) {
    chat.context = batch.context;
  }

  if (batch.mode === BATCH_MODE_SELF) {
    chat.said = true;
  }

  return chat;
}

export function mergeBatchToChat(batch, chat) {
  // 去重.
  let batches = chat.batches;
  for(let b of batches) {
    if (batch.batchId === b.batchId) {
      return;
    }
  }

  batches.push(batch);
  // 排序.
  batches.sort((a, b) => {
    return a.createdAt - b.createdAt;
  });
  chat.count = chat.batches.length;
  return chat;
}

const reset = () => ({
  // 已连接的会话
  unread: 0,
  updated: '',
  connectedSessions: [],
  incomingSessions: [],
  connected: {},
  incoming: {},
  init: false, // 是否已经完成初始化.
  commit: 0,
});

export const chat = {
  state: reset(),

  mutations : {
    [CHAT_RESET] (state) {
      Object.assign(state, reset());
    },
    /**
     * 切换当前会话的 bot 属性.
     */
    [CHAT_TOGGLE_MANUAL] (state, {session, bot}) {
      let con = state.connected[session];
      if (con) {
        con.bot = bot;
        return;
      }

      con = state.incoming[session];
      if (con) {
        con.bot = bot;
      }
    },

    /**
     * 初始化菜单.
     *
     * @param state
     * @param {string} userId
     */
    [CHAT_INIT_MENU] (state, userId) {

      localStorageKey = userId;
      state.commit++;
      let connected = localStorage.getItem(localStorageKey);

      // 如果换身份登录, 把保存的全都删除.
      if (!connected) {
        localStorage.clear();

      } else {
        let unserialized = JSON.parse(connected);
        let saved = Object.values(unserialized);
        for (let c of saved) {
          state.connected[c.session] = createConversation(c, userId);
        }
      }

      state.unread = countUnread(state);
      state.incomingSessions = Object.values(state.incoming)
        .sort((a, b) => a.updatedAt - b.updatedAt)
        .map((c) => c.session);

      state.connectedSessions = Object.values(state.connected)
        .sort((a, b) => a.updatedAt - b.updatedAt)
        .map((c) => c.session);
    },


    /**
     * 删除一个 chat
     * @param state
     * @param session
     */
    [CHAT_DELETE] (state, session) {

      let con = state.connected[session];
      state.commit++;

      // 删除连接中对象.
      if (con) {
        delete state.connected[session];
        let i = state.connectedSessions.indexOf(session);
        state.connectedSessions.splice(i, 1);
      }

      // 删除 incoming 对象.
      con = state.incoming[session];
      if (con) {
        delete state.incoming[session];
        let i = state.incomingSessions.indexOf(session);
        state.incomingSessions.splice(i, 1);
      }
    },

    /**
     * 主动要求保存
     * @param state
     */
    [CHAT_CACHE_CONNECTED] (state) {
      saveConnectedToStorage(state.connected, localStorageKey);
    },

    /**
     * 合并一个 Chat 的信息
     */
    [CHAT_ADD_INFO] (state, {chat, connect}) {
      let session = chat.session;
      state.commit++;
      // auto join connected 先加入.
      if (connect) {
        state.connected[session] = chat;
        insertSession(state.connectedSessions, session);
        state.unread = countUnread(state);
      } else {
        // 添加一个新会话. 会改变排序.
        if (state.init) {
          chat.unread += 1;
        }
        state.incoming[session] = chat;
        insertSession(state.incomingSessions, session);
        state.unread = countUnread(state);
        state.updated = session;
      }

    },

    /**
     * 往目标 chat 里提交一个消息.
     * @param state
     * @param batch
     */
    [CHAT_COMMIT_MESSAGE] (state, batch) {
      if (!batch) {
        Logger.error(CHAT_COMMIT_MESSAGE + ' receive empty batch');
        return;
      }
      state.commit++;

      let session = batch.session;
      let chat = state.connected[session];
      if (!chat) {
        Logger.warn(CHAT_COMMIT_MESSAGE + ' but chat ' + session + ' not exists');
        return;
      }

      // 将 batch 的信息提交给 chat
      if (batch.createdAt >= chat.updatedAt) {
        chat = pushNewBatchToChat(batch, chat);
      // 有可能是老消息, 所以用 merge 的逻辑.
      } else {
        chat = mergeBatchToChat(batch, chat);
      }

      state.unread = countUnread(state);
      state.updated = session;
      insertSession(state.connectedSessions, session);
    },


    [CHAT_MERGE_MESSAGES] (state, {session, batches}) {

      // 合并消息到当前 chat.
      if (!batches.length) {
        return;
      }
      state.commit++;
      let chat = state.connected[session];
      if (!chat) {
        Logger.error(CHAT_MERGE_MESSAGES + ': session ' + session + ' not connected');
        return;
      }

      let originUpdatedAt = chat.updatedAt;
      let hasMessages = chat.batches.length;

      let batchIds = chat.batches.map((c) => c.batchId);
      let unread = 0;
      for (let b of batches) {
        // 消息已经存在, 则跳过.
        let existed = batchIds.indexOf(b.batchId) >= 0;
        if (existed){
          continue;

        }

        chat.batches.push(b);

        if (b.createdAt > originUpdatedAt){
          chat.lastMessage = b.lastMessage;
          chat.updatedAt = b.createdAt;

          // 合并的消息不轻易加红点
          if (originUpdatedAt > 0) {
            unread += getUnread(b);
          }
        }

      }

      // 重新排序.
      chat.batches = chat.batches.sort((a, b) => a.createdAt - b.createdAt);
      // 增加未读数.
      // 不过没有历史消息就不用增加了.
      if (hasMessages) {
        chat.unread += unread;
      }

      // 说明有新消息
      if (unread) {
        state.updated = session;
      }

      state.connected[session] = chat;
      state.unread = countUnread(state);
      chat.count = chat.batches.length;
      insertSession(state.connectedSessions, session);
    },

    [CHAT_RESET_UNREAD] (state, session) {
      let con = state.connected[session];
      state.commit++;
      if (con) {
        con.unread = 0;
        state.unread = countUnread(state);
      }
    },
  },

  actions: {

    /**
     * 合并单个房间信息.
     */
    async [CHAT_ACTION_INFO_MERGE] ({state, commit, dispatch, rootState}, chat) {
      let userId = rootState.user.id;
      let session = chat.session;

      let con = state.connected[session];
      if (con) {
        return;
      }

      if (chat.autoJoin) {
        let merge = createConversation(chat, userId);
        await commit(CHAT_ADD_INFO, {chat:merge, connect: true});
        await dispatch(
          EMITTER_ACTION_JOIN,
          {
            scene:chat.scene,
            session:chat.session,
            bot:chat.bot
          }
        );
        return;
      }

      con = state.incoming[session];
      if (con) {
        await commit(CHAT_ADD_INFO, {chat:con, connect:false});
      } else {
        let merge = createConversation(chat, userId);
        await commit(CHAT_ADD_INFO, {chat:merge, connect:false});
      }
    },

    /**
     * 合并消息.
     */
    [CHAT_ACTION_MESSAGES_MERGE] (
      {state, commit, dispatch},
      {userId, session, limit, batches, forward}
    ) {
      let chat = state.connected[session];
      if (!chat) {
        return;
      }

      // 类型化.
      batches = Object.values(batches);

      if (!batches && !forward) {
        chat.hasElderMessages = false;
        return;
      }

      batches = batches.map((c) => {
        let b = new MessageBatch(c);
        if (b.creatorId === userId) {
          b.mode = BATCH_MODE_SELF;
        }
        return b;
      });

      // 认为还有更多消息.
      let more = limit <= batches.length;

      // 提交消息合并.
      commit(CHAT_MERGE_MESSAGES, {session, batches});

      // 如果是查询新消息,
      if (more && forward) {
        dispatch(
          EMITTER_ACTION_QUERY_MESSAGES,
          {session, forward, limit}
        );
      // 如果是合并老消息
      } else if (!more && !forward) {
        chat.hasElderMessages = false;
      }
    },

    /**
     * 给一个 chat 开启人工.
     * @param commit
     * @param state
     * @param dispatch
     * @param {string} session
     * @param {boolean|null} bot
     * @param {string} alive
     */
    [CHAT_ACTION_TOGGLE_MANUAL] ({commit, state, dispatch}, {session, bot, alive}) {

      let con = state.connected[session];
      if (!con) {
        return;
      }

      // 表示取反.
      if (bot === null) {
        bot = !con.bot;
      }

      // 告知服务端转人工.
      if (bot === false) {
        dispatch(EMITTER_ACTION_MANUAL, {scene:con.scene, session:con.session});
      }

      // 提交当前改动.
      commit(CHAT_TOGGLE_MANUAL, {session, bot});
      if (alive === session) {
        let info = bot ? '切换到机器人': '切换到人工';
        commit(LAYOUT_SNACK_BAR_TOGGLE, info);
      }
    },

    // 关闭会话.
    [CHAT_ACTION_CLOSE] ({state, commit, dispatch}, {session, reason}) {

      let con = state.connected[session];

      if (con) {
        dispatch(EMITTER_ACTION_LEAVE, {scene:con.scene, session:con.session});
      }

      commit(CHAT_DELETE, session);

      if (reason) {
        let info = 'session ' + session + ' deleted: ' + reason;
        commit(LAYOUT_SNACK_BAR_TOGGLE, info);
        Logger.error(info);
      }

      saveConnectedToStorage(state.connected, localStorageKey)
    },
    /**
     * 尝试连接一个 incoming 位置的 session
     */
    [CHAT_ACTION_CONNECT_INCOMING] ({state, dispatch}, session) {

      // 如果是已连接会话.
      let con = state.connected[session];
      if (con) {
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

        dispatch(EMITTER_ACTION_JOIN, {session, scene:con.scene, bot:con.bot});

        insertSession(state.connectedSessions, session);
        countUnread(state);
        saveConnectedToStorage(state.connected, localStorageKey);
        return;
      }

      Logger.warn('session ' + session + ' not exists');
    },

  }
};