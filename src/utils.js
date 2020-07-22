import {Response} from "./socketio/Response";
import Logger from "js-logger";

export function getResponse(res, caller) {
  let response = new Response(res);

  if (process.env.VUE_APP_DEBUG) {
    Logger.debug('getResponse', response);
  }
  caller(response.proto);
}
