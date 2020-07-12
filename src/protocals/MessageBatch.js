
import Message from './Message';
import TextMessage from "./TextMessage";
import createMessage from "./CreateMessage";

export default class MessageBatch {

  /**
   * 是否是输入消息
   * @type {boolean}
   */
  isInput = false;

  /**
   * 消息的批次 ID
   * @type {string}
   * @private
   */
  batchId = '';

  /**
   * 发送者Id.
   * @type {string}
   */
  creatorId = '';

  /**
   * 发送者名称.
   * @type {string}
   */
  creatorName = '';

  /**
   *
   * @type {Message[]}
   */
  messages = [];

  constructor(data) {
    if (!(data instanceof Object)) {
      throw new Error('construct value is not object');
    }

    // 处理 batchId.
    let batchId = data.batchId ? data.batchId : '';

    // 处理 message.
    let messages = data.message ? data.message : [];
    if (!(messages instanceof Array)) {
      throw new Error('messages must be array')
    }

    delete data.message;
    for (let message of messages) {

      let messageIns = createMessage(message);

      console.log('message ins', messageIns);
      this.append(messageIns);

      batchId = batchId ? batchId : messageIns.id;
    }

    data.batchId = batchId;

    Object.assign(this, data);
  }

  append(message) {
    if (!(message instanceof Message)) {
      return;
    }
    this.messages.push(message);
  }

  static createByMessage(message, creatorName, creatorId, isInput = true) {
    if (!(message instanceof Message)) {
      console.log(message);
      throw new Error('message must be instanceof Message');
    }

    return new MessageBatch({
      isInput : isInput,
      creatorId : creatorId,
      creatorName : creatorName,
      batchId : message.id,
      messages : [message]
    });
  }

  static fake(isInput = false) {

    return new MessageBatch({
      isInput : isInput,
      creatorId : 'test',
      creatorName : 'test',
      messages : [
        TextMessage.fake()
      ],
    });
  }
}