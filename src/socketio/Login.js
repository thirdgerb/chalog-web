

export default class Login {
  id;
  name;
  token;

  constructor({id, name, token}) {
    this.id = id;
    this.name = name;
    this.token = token;
  }
}