import {v4 as uuidV4} from 'uuid';

class Message {

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

  constructor(data)
  {
    data.id = data.id ? data.id : uuidV4();
    Object.assign(this, data);
  }

}

export default Message;
