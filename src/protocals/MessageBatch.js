
import Message from './Message';
import createMessage from './CreateMessage';
import User from './User';


export const MODE_SELF = 0;
export const MODE_BOT = 1;
export const MODE_USER = 2;
export const MODE_SYSTEM = 3;

export class MessageBatch {

  /**
   * 是否是输入消息
   * @type {boolean}
   */
  mode;

  /**
   * 消息的批次 ID
   * @type {string}
   */
  batchId;

  creatorId;
  /**
   * 发送者名称.
   * @type {string}
   */
  creatorName;

  /**
   * 消息
   * @type {Message[]}
   */
  messages = [];

  /**
   * 时间表示.
   */
  date;

  suggestions;

  constructor({
    mode,
    creatorId,
    creatorName,
    batchId,
    messages,
  }) {
    this.mode = mode;
    this.creatorId = creatorId;
    this.creatorName = creatorName;
    this.batchId = batchId;
    this.messages = messages || [];

    let date = new Date();
    this.date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  /**
   *
   * @param message
   * @returns {*}
   */
  appendMessage(message) {
    if (!(message instanceof Message)) {
      return;
    }
    this.messages.push(message);
    return this;
  }

  /**
   *
   * @param {Message} message
   * @param {User} user
   * @param {int}mode
   * @returns {MessageBatch}
   */
  static createByMessage(message, user, mode = MODE_SELF) {
    if (!(message instanceof Message)) {
      throw new Error('message must be instanceof Message');
    }

    if (!(user instanceof User)) {
      throw new Error('user must be instanceof User');
    }


    let batch = new MessageBatch({
      mode,
      creatorId: user.id,
      creatorName: user.name,
      batchId : message.id,
    });

    batch.appendMessage(createMessage(message));
    return batch;
  }

  get lastMessage() {
    let last = this.messages.length - 1;
    let message = this.messages[last];

    return message ? message.brief() : '';
  }
}