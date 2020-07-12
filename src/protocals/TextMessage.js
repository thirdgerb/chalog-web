import Message from "./Message";
import {MESSAGE_TEXT} from "../constants";

export default class TextMessage extends Message{

  text = '';

  /**
   *
   * @param data
   */
  constructor(data) {
    super(MESSAGE_TEXT, data.id);
    this.text = data.text;
  }

  /**
   * @param text {string}
   * @returns {TextMessage}
   */
  static create(text) {
    return new TextMessage({
      text: text
    });
  }

  /**
   *
   * @returns {TextMessage}
   */
  static fake() {
    return new TextMessage({
      text: '在公众号对话框中输入以下内容, 可在公众号对话中操作本网页',
    })
  }
}