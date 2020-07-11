import Message from "./Message";
import {MESSAGE_TEXT} from "../constants";


export default class TextMessage extends Message{

  text = '';

  constructor(data) {
    data.type = MESSAGE_TEXT;
    super(data)
  }

  static fake() {
    return new TextMessage({
      text: '在公众号对话框中输入以下内容, 可在公众号对话中操作本网页',
    })
  }
}