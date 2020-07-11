// import {v4 as uuidV4} from 'uuid';

// class User {
//
//   id;
//   name;
//
//   constructor(name, id = null)
//   {
//     this.name = name;
//     this.id = id ? id : uuidV4();
//   }
//
// }
//
// class Event {
//   name;
//   payload;
//
//   constructor(name, payload)
//   {
//     this.name = name;
//     this.payload = payload;
//   }
// }
//
// const EVENT_ACK = 'system.ack';
//

// class Message
// {
//   // 消息唯一ID
//   id = '';
//   // 是否是输入消息
//   isInput = true;
//   // 创建者名称
//   creator = '';
//   // 会话ID
//   sessionId = '';
//   // 消息创建时间
//   createdAt = 0;
//   // 消息体.
//   message;
//
//   constructor(data)
//   {
//     this.id = data.id;
//     this.message = message;
//     this.isInput = data.isInput;
//     this.creator = data.creator;
//     this.createdAt = data.createdAt;
//     this.sessionId = data.sessionId;
//     this.message = new MessageData(data.message);
//   }
//
// }
//
// const MESSAGE_TYPE_TEXT = 'text';
// const MESSAGE_TYPE_VIDEIO = 'video';
//
// class MessageData
// {
//   type = ''; // text,
//   data = {};
//
//   constructor(message)
//   {
//     Object.assign(this, message);
//   }
// }

// /**
//  * @property {string} sessionId
//  */
// export class ChatInfo {
//
//   /**
//    * 对话场景
//    * @type {string}
//    */
//   scene = '';
//
//   /**
//    * sessionId 的设置值.
//    * 如果没有需要自动生成一个.
//    * @type {string}
//    */
//   sessionId = '';
//
//   /**
//    * 分组的标题.
//    * @type {string}
//    */
//   title ='';
//
//   /**
//    * 分组的图标.
//    * @type {string}
//    */
//   icon='';
//
//   /**
//    * 是否有新消息.
//    * @type {boolean}
//    */
//   hasNew = false;
//
//   /**
//    * 消息体
//    * @type {MessageBatch[]}
//    */
//   batches = [];
//
//   /**
//    * 当前的建议
//    * @type {string[]}
//    */
//   suggestions = [];
//
//   /**
//    * 最后一条消息的简述.
//    * @returns {string}
//    */
//   get lastMessage() {
//     return ''
//   }
//
//   constructor() {
//   }
//
//   appendMessage(messages) {
//
//   }
// }
//
// /**
//  * 消息批次
//  */
// export class MessageBatch {
//
//   /**
//    * 消息的批次 ID
//    * @type {string}
//    */
//   batchId = '';
//
//   /**
//    * 发送者Id.
//    * @type {string}
//    */
//   creatorId = '';
//
//   /**
//    * 发送者名称.
//    * @type {string}
//    */
//   creatorName = '';
//
//   /**
//    * 创建时间.
//    * @type {string}
//    */
//   createdAt = '20:00:00';
//
//   /**
//    *
//    * @type {Message[]}
//    */
//   messages = [];
// }
//
// export class Message {
//
// }

/**
 * 对话分组.
 */
export class Chat
{
  // 对话的场景, 决定机器人响应的对象.
  scene = '';
  // 对话指定的 SessionId. 如果不指定, 服务端应该生成一个.
  sessionId = '';
  // 会话的标题
  title = '';
  // 会话的图标, 没有的话应该用默认的.
  icon = '';
  // 会话的简介. 鼠标悬停的时候应该呈现.
  desc = '';
  // 是否有未读的新消息.
  hasNew = true;
  // 最后的一条消息.
  lastMessage = '';
  // 最后的响应时间.
  receivedAt = '';

  constructor(data)
  {
    Object.assign(this, data);
  }

  get id() {
    return this.sessionId;
  }

}
