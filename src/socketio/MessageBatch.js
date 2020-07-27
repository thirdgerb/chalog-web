
import {
  createMessage,
  Message,
} from './Message';


export const BATCH_MODE_SELF = 0;
export const BATCH_MODE_BOT = 1;
export const BATCH_MODE_USER = 2;
export const BATCH_MODE_SYSTEM = 3;

export class MessageBatch {

  /**
   * 是否是输入消息
   * @type {int}
   */
  mode;

  session;

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

  createdAt;

  suggestions;

  context;


  /**
   *
   * @param {int} mode
   * @param {string} session
   * @param {string} batchId
   * @param {string} creatorId
   * @param {string} creatorName
   * @param {int} createdAt
   * @param {Object} suggestions
   * @param {Object} context
   * @param {Message[]} messages
   */
  constructor({
    mode,
    session,
    batchId,
    creatorId,
    creatorName,
    createdAt,
    suggestions ,
    context,
    messages,
  }) {
    this.mode = mode;
    this.creatorId = creatorId;
    this.creatorName = creatorName;
    this.session = session;
    this.batchId = batchId;
    this.createdAt = createdAt || Date.parse((new Date()).toString()) / 1000;
    this.suggestions = suggestions || {};
    this.context = context || {};

    messages = messages || [];
    for(let i in messages) {
      let message = createMessage(messages[i]);
      this.appendMessage(message);
    }
  }

  _date;
  get date() {
    if (this._date) {
      return this._date;
    }
    let date = new Date(this.createdAt);
    return this._date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  /**
   *
   * @param {Message} message
   * @returns {*}
   */
  appendMessage(message) {
    if (!(message instanceof Message)) {
      return;
    }
    this.messages.push(message);
    return this;
  }

  get isNew() {
    return this.mode === BATCH_MODE_USER || this.mode === BATCH_MODE_BOT;
  }

  /**
   *
   * @param {string} session
   * @param {Message} message
   * @param {string} id
   * @param {string} name
   * @param {int}mode
   * @returns {MessageBatch}
   */
  static createByMessage(session, message, {id, name}, mode = BATCH_MODE_SELF) {
    if (!(message instanceof Message)) {
      throw new Error('message must be instanceof Message');
    }

    if (!id || !name) {
      throw new Error('user id or name should not be empty');
    }

    let batch = new MessageBatch({
      mode,
      session,
      batchId : message.id,
      creatorId: id,
      creatorName: name,
    });

    batch.appendMessage(createMessage(message));
    return batch;
  }

  get lastMessage() {
    let last = this.messages.length - 1;
    let message = this.messages[last];

    let brief =  message ? message.brief() : '';
    if (!brief) {
      return '';
    }

    let mode = this.mode;
    if (mode !== BATCH_MODE_SELF && mode !== BATCH_MODE_SYSTEM) {
      return this.creatorName + ':' + brief;
    }
    return brief;
  }
}