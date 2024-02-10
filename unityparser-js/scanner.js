const jsYaml = require("js-yaml");

class Scanner {
  constructor() {
    this.prev_tokens = [];
  }

  check_prev_token(...choices) {
    if (this.prev_tokens.length) {
      if (!choices.length) {
        return true;
      }
      for (let choice of choices) {
        if (this.prev_tokens[this.prev_tokens.length - 1] instanceof choice) {
          return true;
        }
      }
    }
    return false;
  }

  get_token() {
    const tokens = jsYaml.safeLoad(this.yamlText);
    if (tokens.length) {
      this.prev_tokens.push(tokens.shift());
      return this.prev_tokens[this.prev_tokens.length - 1];
    }
  }

  fetch_anchor() {
    const tokens = jsYaml.safeLoad(this.yamlText);
    this.prev_tokens.push(tokens.find((token) => token.anchor));
    this.fetch_extra_anchor_data();
  }

  fetch_extra_anchor_data() {
    const lastToken = this.prev_tokens[this.prev_tokens.length - 1];
    if (lastToken && lastToken.anchor) {
      lastToken.extra_anchor_data = lastToken.value;
    }
  }
}

module.exports = Scanner;
