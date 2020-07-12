import {
  MESSAGE_TEXT,
  // MESSAGE_EVENT,
  MESSAGE_BILI
} from "../constants";
import TextMessage from "./TextMessage";
import BiliMessage from "./BiliMessage";
import Message from "./Message";


/**
 * @param data {Object}
 * @returns {null|Message}
 */
export default function createMessage(data) {
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
      console.log('invalid data type' + data.type);
      return null;
  }
}