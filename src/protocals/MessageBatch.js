
// import uuidV4 from 'uuid';

export class MessageBatch {

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
   * 创建时间.
   * @type {string}
   */
  createdAt = '20:00:00';

  /**
   *
   * @type {Message[]}
   */
  messages = [];

}