import {v4 as uuidV4} from 'uuid';

export default class Message {

  /**
   * 消息体的唯一 ID
   * @type {string}
   */
  id = '';

  /**
   * 消息的协议类型.
   * @type {string}
   */
  type = '';

  constructor(type, id = null)
  {
    this.id = id ? id : uuidV4();
    this.type = type;
  }

  lastInfo () {
    return this.id;
  }
}

