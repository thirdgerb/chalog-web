
import MessageBatch from "./MessageBatch";

/**
 * @property {MessageBatch} lastBatch
 * @property {string} lastMessage
 */
export default class ChatInfo {

  /**
   * sessionId 的设置值.
   * @type {string}
   */
  session;

  /**
   * 对话场景
   * @type {string}
   */
  scene;

  /**
   * 是否有新消息.
   * @type {boolean}
   */
  hasNew = false;

  /**
   * 当前的消息
   * @type {MessageBatch[]}
   */
  batches = [];

  /**
   * 当前的建议
   * @type {string[]}
   */
  suggestions = [];

  /**
   * @type {boolean}
   */
  isSaid = false;

  /**
   * Chat 自身是否在等待回复.
   * @type {boolean}
   */
  loading = false;

  constructor(
    {
      scene,
      session
    }
  ) {
    this.session = session;
    this.scene = scene;
  }


  /**
   * 最后一条消息的简述.
   * @returns {string}
   */
  get lastMessage() {
    let batch = this.lastBatch;
    return batch ? batch.lastMessage : '';
  }

  /**
   * @returns {MessageBatch}
   */
  get lastBatch() {
    if (this.batches.length > 0) {
      return this.batches[this.batches.length - 1];
    }
    return null;
  }

  appendBatch(batch) {
    if (batch instanceof MessageBatch) {
      this.batches.push(batch);

    } else {
      throw new Error('invalid batch info ' + batch);
    }
  }
}
