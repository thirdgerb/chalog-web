import Message from "./Message";
import {MESSAGE_TEXT} from "../constants";

export default class TextMessage extends Message{

  text = '';

  /**
   *
   * @param text
   * @param id
   */
  constructor({text, id}) {
    super(MESSAGE_TEXT, id);
    this.text = text;
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

  /**
   *
   * @returns {TextMessage}
   */
  static fake() {
    return new TextMessage({
      text: '在公众号对话框中输入以下内容, 可在公众号对话中操作本网页',
    })
  }


  brief () {
    return this.text;
  }
}