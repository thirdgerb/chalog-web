
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
  sessionId = '';

  /**
   * 对话场景
   * @type {string}
   */
  scene = '';

  /**
   * 分组的标题.
   * @type {string}
   */
  title ='';

  /**
   * 分组的图标.
   * @type {string}
   */
  icon='';

  /**
   * 是否有新消息.
   * @type {boolean}
   */
  hasNew = false;

  batches = [];

  /**
   * 当前的建议
   * @type {string[]}
   */
  suggestions = [];

  closable = true;

  constructor(
    title,
    sessionId,
    scene = '',
    icon = '',
    closable = true
  ) {
    this.sessionId = sessionId;
    this.title = title;
    this.scene = scene;
    this.icon = icon;
    this.closable = closable
  }

  /**
   *
   * @param {NavItem} nav
   * @param {string} userId
   * @returns {ChatInfo}
   */
  static fromNavItem(nav, userId)
  {
    let session = nav.makeSession(userId);
    return new ChatInfo(
      nav.title,
      session,
      nav.scene,
      nav.icon,
      nav.closable
    )
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

  get hasSuggesions() {
    return this.suggestions.length > 0;
  }

  appendBatch(batch) {
    if (batch instanceof MessageBatch) {
      this.batches.push(batch);
    } else {
      console.log('invalid batch info ', batch);
    }
  }
}
