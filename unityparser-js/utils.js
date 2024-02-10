const fs = require("fs");
const yaml = require("js-yaml");
const { UnityDumper } = require("./dumper");
const { UnityDocumentError } = require("./errors");
const { UnityLoader } = require("./loader");
const { UnityScalarRegister } = require("./register");
const UNIX_LINE_ENDINGS = "\n";

class UnityDocument {
  constructor(data, newline = null, filePath = null, register = null) {
    this.newline = newline;
    this.data = data;
    this.filePath = filePath;
    this.register = register || new UnityScalarRegister();
  }

  get entry() {
    return this.data[0];
  }

  get entries() {
    return this.data;
  }

  dump_yaml(filePath = null, options = {}) {
    filePath = filePath || this.filePath;
    assert_or_raise(
      filePath !== null,
      new UnityDocumentError("filePath parameter must be passed")
    );
    let yamlStr = yaml.safeDump(this.data, options);
    fs.writeFileSync(filePath, yamlStr, { encoding: "utf-8" });
  }
  static load_yaml(filePath) {
    let register = new UnityScalarRegister();
    let yamlStr = fs.readFileSync(filePath, "utf-8");
    let data = yaml.safeLoadAll(yamlStr, register);
    let line_endings = UNIX_LINE_ENDINGS;
    let doc = new UnityDocument(data, line_endings, filePath, register);
    return doc;
  }

  filter(classNames = null, attributes = null) {
    let entries = this.entries;
    if (classNames) {
      entries = entries.filter((x) => classNames.includes(x.constructor.name));
    }
    if (attributes) {
      entries = entries.filter((x) =>
        attributes.every((attr) => x.hasOwnProperty(attr))
      );
    }
    return entries;
  }

  get(className = null, attributes = null) {
    let entries = this.filter([className], attributes);
    assert_or_raise(
      entries.length > 0,
      new UnityDocumentError("get method must return one entry. none found")
    );
    assert_or_raise(
      entries.length === 1,
      new UnityDocumentError("get method must return one entry. multiple found")
    );
    return entries[0];
  }
}

function assert_or_raise(condition, exception) {
  if (!condition) {
    throw exception;
  }
}

module.exports = { UnityDocument };
