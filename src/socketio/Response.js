import Logger from "js-logger";

export class Response {

  trace;
  proto;

  constructor({trace, proto}) {
    this.trace = trace;
    this.proto = proto;
    Logger.trace(this);
  }

}