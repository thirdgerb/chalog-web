import {v4 as uuid} from 'uuid';

export class User {

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

  constructor(data) {

    data.id = data.id ? data.id : uuid();
    data.name = data.name ? data.name : 'guest';
    Object.assign(this, data);
  }

}