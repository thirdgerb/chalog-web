import md5 from 'js-md5';

export default class NavItem {
  title;
  scene;
  icon;
  session = '';
  closable = true;

  constructor(data) {
    Object.assign(this, data);
  }

  makeSession(userId) {
    if (this.session) {
      return this.session;
    }
    return md5('title:' + this.title + ':user:' + userId);
  }
}
