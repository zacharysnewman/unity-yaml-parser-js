const yaml = require("js-yaml");

class Representer extends yaml.Dumper {
  constructor(
    default_style = null,
    default_flow_style = false,
    sort_keys = true,
    register = null
  ) {
    super({
      styles: default_style,
      flowLevel: default_flow_style ? -1 : 4,
      sortKeys: sort_keys,
    });
    this.register = register;
  }
}
