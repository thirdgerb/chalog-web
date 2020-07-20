

/*--------- 定义方法 ----------*/

import {Response} from "./socketio/Response";
import NavItem from "./protocals/NavItem";
import ChatInfo from "./protocals/ChatInfo";

export function insertMenu(menu, ...items) {
  let chatArr = Object.values(menu);

  chatArr.unshift(...items);
  let newChats = {};
  for (let i of chatArr) {
    newChats[i.session] = i;
  }

  return newChats;
}


/**
 * @param {string} userId
 * @param {Object} items
 */
export function createMenu(userId, ...items) {
  let menu = {};
  for (let item of items) {
    let nav = NavItem.from(item, userId);
    menu[nav.session] = nav;
  }
  return menu;
}

export function insertChats(chats, ...navItems) {
  for (let nav of navItems) {
    chats[nav.session] = new ChatInfo({
      scene: nav.scene,
      session: nav.session,
      bot: nav.bot,
    });
  }
}

export function getResponse(res, caller) {
  let response = new Response(res);
  if (process.env.VUE_APP_DEBUG) {
    console.log('receive ' + response);
  }
  caller(response.proto);
}
