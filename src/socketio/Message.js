import {v4 as uuidV4} from "uuid";
import Logger from 'js-logger';


export const MESSAGE_TEXT = 'text';
export const MESSAGE_BILI = 'bili';

export function createMessage(data) {
  if (!(data instanceof Object)) {
    throw new Error('create data must be Object');
  }

  if (data instanceof Message) {
    return data;
  }

  let type = data.type;
  switch(type) {
    case MESSAGE_TEXT :
      return new TextMessage(data);
    case MESSAGE_BILI :
      return new BiliMessage(data);
    default :
      Logger.error('invalid data type ' + data.type);
      return null;
  }
}


export class Message {

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

  brief () {
    return this.id;
  }
}

export class TextMessage extends Message{

  text = '';
  md;
  level;

  constructor({text, id, md, level}) {
    super(MESSAGE_TEXT, id);
    this.text = text;
    this.md = !!md;
    this.level = level;
  }

  /**
   * @param text {string}
   * @returns {TextMessage}
   */
  static create(text) {
    return new TextMessage({
      text
    });
  }

  brief () {
    return this.text;
  }
}

export class BiliMessage extends Message {

  /**
   * 视频连接地址.
   */
  resource;
  text = '';

  constructor({id, resource, text})
  {
    super(MESSAGE_BILI, id);
    this.resource = resource;
    this.text = text;
  }

  static create(resource) {
    return new BiliMessage({resource});
  }

  brief () {
    return this.text || '视频';
  }
}