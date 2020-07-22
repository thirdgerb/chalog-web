import {v4} from 'uuid';
import Logger from "js-logger";

export default class Request {
  trace;
  token;
  proto;

  constructor({trace, token, proto}) {
    this.trace = trace || v4();
    this.token = token;
    // 是否要校验 proto
    this.proto = proto;
    Logger.trace(this);
  }
}