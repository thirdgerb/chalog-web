

export default class Sign {
  name;
  password;
  token;

  constructor({name, password, token})
  {
    this.name = name;
    this.password = password;
    this.token = token;
  }
}