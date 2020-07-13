
import Message from './Message';
import TextMessage from "./TextMessage";
import createMessage from './CreateMessage';

export default class MessageBatch {

  /**
   * 是否是输入消息
   * @type {boolean}
   */
  isInput = false;

  /**
   * 消息的批次 ID
   * @type {string}
   */
  batchId = '';

  /**
   * @type {boolean}
   */
  loading = false;

  /**
   * 发送者名称.
   * @type {string}
   */
  creatorName = '';

  messages = [];

  constructor(data) {
    if (!(data instanceof Object)) {
      throw new Error('construct value is not object');
    }


    delete data.message;
    Object.assign(this, data);
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

  static createByMessage(message, creatorName, creatorId, isInput = true) {
    if (!(message instanceof Message)) {
      console.log(message);
      throw new Error('message must be instanceof Message');
    }

    let batch = new MessageBatch({
      isInput : isInput,
      creatorId : creatorId,
      creatorName : creatorName,
      batchId : message.id,
    });

    batch.appendMessage(createMessage(message));
    return batch;
  }

  static fake(isInput = false) {

    let batch =  new MessageBatch({
      isInput : isInput,
      creatorId : 'test',
      creatorName : 'test',

    });

    batch.appendMessage(TextMessage.fake());
    return batch;
  }

  get lastMessage() {
    let last = this.messages.length - 1;
    let message = this.messages[last];

    return message ? message.lastInfo() : '';
  }
}