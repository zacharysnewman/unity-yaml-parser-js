const yaml = require("js-yaml");
const collections = require("collections");
const OrderedFlowDict = require("./constants").OrderedFlowDict;
class uniqstr extends String {
  constructor(content) {
    super(content);
  }
}
class Constructor extends yaml.constructor {
  constructor(register = null) {
    super();
    this.register = register;
  }

  construct_mapping(node, deep = false) {
    if (!(node instanceof yaml.nodes.MappingNode)) {
      throw new yaml.constructor.ConstructorError(
        null,
        null,
        `expected a mapping node, but found ${node.id}`,
        node.start_mark
      );
    }
    // UNITY: dict has to be ordered to reproduce nested maps, also save flow style
    let mapping = new OrderedFlowDict();
    mapping.set_flow_style(node.flow_style);
    for (let [key_node, value_node] of node.value) {
      let key = this.construct_object(key_node, deep);
      if (!collections.hashable(key)) {
        throw new yaml.constructor.ConstructorError(
          "while constructing a mapping",
          node.start_mark,
          "found unhashable key",
          key_node.start_mark
        );
      }
      let value = this.construct_object(value_node, deep);
      mapping.set(key, value);
    }
    return mapping;
  }

  construct_scalar(node) {
    let value = super.construct_scalar(node);
    if (typeof value === "string" && node.style !== null) {
      value = new uniqstr(value);
      this.register.set(value, node.style);
    }
    return value;
  }
}

module.exports = Constructor;
