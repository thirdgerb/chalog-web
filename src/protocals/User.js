import {v4 as uuid} from 'uuid';

export default class User {

  /**
   * 用户的 uuid
   * @type {string}
   */
  id;

  /**
   * 用户的名称
   */
  name;

  /**
   * 服务端下发的 token
   */
  token = '';

  constructor({id, name, token}) {

    this.id = id ? id : uuid();
    this.name = name ? name : 'guest';
    this.token = token ? token : '';
  }

}