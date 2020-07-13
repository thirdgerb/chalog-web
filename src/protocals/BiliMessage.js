import {MESSAGE_BILI} from "../constants";
import Message from './Message';

export default class BiliMessage extends Message {

  /**
   * 视频连接地址.
   */
  url;

  constructor(data)
  {
    super(MESSAGE_BILI, data.id);
    this.url = data.url;
  }

  static create(url) {
    return new BiliMessage({url: url});
  }

  static fake() {
    return new BiliMessage({
      url: "//player.bilibili.com/player.html?aid=94527292&bvid=BV1nE411g7Lc&cid=161355478&page=1",
    })
  }


  lastInfo () {
    return '视频';
  }
}