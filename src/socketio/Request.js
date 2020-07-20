
import {v4} from 'uuid';

export default class Request {
  trace;
  token;
  proto;

  constructor({trace, token, proto}) {
    this.trace = trace || v4();
    this.token = token;
    // 是否要校验 proto
    this.proto = proto;
  }
}