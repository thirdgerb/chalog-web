

export default class Context {

  id;
  name;
  stage;
  query;
  data;
  suggestions;

  constructor({
    id,
    name,
    stage,
    query,
    data,
    suggestions,
  }) {
    this.id = id;
    this.name = name;
    this.stage = stage;
    this.query = query;
    this.data = data;
    this.suggestions = suggestions;
  }
}