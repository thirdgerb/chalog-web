

export default class ErrorInfo {
  errcode;
  errmsg;

  constructor({errcode, errmsg}) {
    this.errcode = errcode;
    this.errmsg = errmsg;
  }
}