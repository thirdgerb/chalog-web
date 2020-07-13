import md5 from 'js-md5';

export default class NavItem {
  title;
  scene;
  icon;
  session;
  closable;
  hasNew = true;

  constructor({
    scene,
    title,
    icon,
    session,
    closable
  }) {
    this.scene = scene;
    this.title = title;
    this.icon = icon ? icon : 'mdi-forum';
    this.closable = !! closable;
    this.session = session ? session : '';
  }

  static from({
      scene,
      title,
      icon,
      session,
      closable
    },
    userId
  ) {
    if (!session) {
      session = md5('scene:' + scene + ':user:' + userId);
    }
    return new NavItem({
      scene,
      title,
      icon,
      session,
      closable
    })
  }
}
