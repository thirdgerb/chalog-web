import {Chat} from './protocals';


export let chat1 = new Chat({
  sessionId : 'a1',
  scene : '',
  title : '会话测试1',
  icon : 'mdi-robot',
  desc : '',
  hasNew : true,
  lastMessage : '最后一条消息',
  receivedAt : '1 min'
});

export let chat2 = new Chat({
  sessionId : 'a2',
  scene : '',
  title : '会话测试2',
  icon : 'mdi-robot',
  desc : '',
  hasNew : true,
  lastMessage : '最后一条消息',
  receivedAt : '1 min'
});

export let chat3 = new Chat({
  sessionId : 'a3',
  scene : '',
  title : '会话测试3',
  icon : 'mdi-robot',
  desc : '',
  hasNew : false,
  lastMessage : '最后一条消息',
  receivedAt : '1 min'
});

export let chat4 = new Chat({
  sessionId : 'a4',
  scene : '',
  title : '会话测试4',
  icon : 'mdi-robot',
  desc : '',
  hasNew : true,
  lastMessage : '最后一条消息',
  receivedAt : '1 min'
});

export let chats = {};
chats[chat1.sessionId] = chat1;
chats[chat2.sessionId] = chat2;
chats[chat3.sessionId] = chat3;
chats[chat4.sessionId] = chat4;
for(let i=5; i< 7 ; i++) {
  let newChat = new Chat(chat3);
  newChat.sessionId = 'a' + i;
  chats[i] = newChat;
}



