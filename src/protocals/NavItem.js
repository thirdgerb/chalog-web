import md5 from 'js-md5';

export default class NavItem {
  title;
  scene;
  icon;
  session;
  closable;
  bot; // 是与机器人通信还是?

  constructor({
    scene,
    title,
    icon,
    session,
    closable,
    bot = true
  }) {
    this.scene = scene;
    this.title = title || scene;
    this.icon = icon || 'mdi-forum';
    this.closable = !! closable;
    this.session = session ? session : '';
    this.bot = bot;
  }

  static from({
      scene,
      title,
      icon,
      session,
      closable,
      bot = true
    },
    userId
  ) {
    if (!session) {
      session = md5('scene:' + scene + ':user:' + userId);
    }
    title = title || scene;
    return new NavItem({
      scene,
      title,
      icon,
      session,
      closable,
      bot
    })
  }
}
