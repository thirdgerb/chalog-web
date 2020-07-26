import {Response} from "./socketio/Response";
import Logger from "js-logger";

export function getResponse(event, res, caller) {

  let response = new Response(event, res);

  Logger.debug('getResponse', response);
  caller(response.proto);
}
