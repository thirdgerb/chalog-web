import {Response} from "./socketio/Response";
import Logger from "js-logger";

export function getResponse(res, caller) {
  let response = new Response(res);

  Logger.debug('getResponse', response);
  caller(response.proto);
}
