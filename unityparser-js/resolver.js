const yaml = require("js-yaml");
const regex = require("regex");

class Resolver extends yaml.Type {
  constructor() {
    super("tag:yaml.org,2002:str", {
      kind: "scalar",
      resolve: (data) => typeof data === "string",
      construct: (data) => data,
      instanceOf: String,
      represent: (data) => data,
    });
  }
}
const FLOAT_REGEX = regex(
  "^(?:[-+]?(?:0|[1-9][0-9]*).(?:[1-9]|[0-9][0-9]*[1-9])?)$"
);
const INT_REGEX = regex("^(?:[-+]?(?:0|[1-9][0-9]*))$");
const NULL_REGEX = regex("^(?: )$");
const YAML_REGEX = regex("^(?:!|&|*)$");

const floatResolver = new Resolver();
floatResolver.kind = "scalar";
floatResolver.resolve = (data) => FLOAT_REGEX.test(data);
floatResolver.construct = (data) => parseFloat(data);
floatResolver.instanceOf = Number;
floatResolver.represent = (data) => data.toString();

const intResolver = new Resolver();
intResolver.kind = "scalar";
intResolver.resolve = (data) => INT_REGEX.test(data);
intResolver.construct = (data) => parseInt(data, 10);
intResolver.instanceOf = Number;
intResolver.represent = (data) => data.toString();

const nullResolver = new Resolver();
nullResolver.kind = "scalar";
nullResolver.resolve = (data) => NULL_REGEX.test(data);
nullResolver.construct = () => null;
nullResolver.instanceOf = null;
nullResolver.represent = () => "";

const yamlResolver = new Resolver();
yamlResolver.kind = "scalar";
yamlResolver.resolve = (data) => YAML_REGEX.test(data);
yamlResolver.construct = (data) => data;
yamlResolver.instanceOf = String;
yamlResolver.represent = (data) => data;

const SCHEMA = yaml.DEFAULT_SCHEMA.extend([
  floatResolver,
  intResolver,
  nullResolver,
  yamlResolver,
]);

module.exports = { SCHEMA };
