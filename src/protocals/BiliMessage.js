import {MESSAGE_BILI} from "../constants";
import Message from './Message';

export default class BiliMessage extends Message {

  /**
   * 视频连接地址.
   */
  url;

  constructor(data)
  {
    data.type = MESSAGE_BILI;
    super(data);
  }

  static fake() {
    return new BiliMessage({
      url: "//player.bilibili.com/player.html?aid=94527292&bvid=BV1nE411g7Lc&cid=161355478&page=1",
    })
  }

}