import {Message} from "./Message";

export default class Input {

  session;
  scene;
  bot;
  message;
  query;
  createdAt;

  constructor({session, scene, bot, createdAt }, message, query) {
    if (!(message instanceof Message)) {
      throw new Error('message is not instance of Message:' + message);
    }
    this.message = message;
    this.session = session;
    this.scene = scene;
    this.bot = bot;
    this.createdAt = createdAt || new Date().getTime();
    this.query = query;
  }
}