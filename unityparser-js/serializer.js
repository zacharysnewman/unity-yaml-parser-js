const yaml = require("js-yaml");
// override serializer class to store data needed
// for extra data on anchor lines
class Serializer extends yaml.Type {
  constructor(
    encoding = null,
    explicitStart = null,
    explicitEnd = null,
    version = null,
    tags = null
  ) {
    super();
    this.encoding = encoding;
    this.explicitStart = explicitStart;
    this.explicitEnd = explicitEnd;
    this.version = version;
    this.tags = tags;
    this.extraAnchorData = {};
    this.closed = null;
    this.serializedNodes = {};
    this.anchors = {};
    this.lastAnchorId = 0;
  }

  serialize(node) {
    if (this.closed === null) {
      throw new Error("serializer is not opened");
    } else if (this.closed) {
      throw new Error("serializer is closed");
    }
    this.emit("documentStart", {
      explicit: this.explicitStart,
      version: this.version,
      tags: this.tags,
    });
    this.anchorNode(node);
    this.serializeNode(node, null, null);
    this.emit("documentEnd", { explicit: this.explicitEnd });
    this.serializedNodes = {};
    this.anchors = {};
    this.extraAnchorData = {};
    this.lastAnchorId = 0;
  }

  // placeholder for anchorNode method
  anchorNode(node) {
    // to be implemented
  }

  // placeholder for serializeNode method
  serializeNode(node, parent, index) {
    // to be implemented
  }
}

module.exports = Serializer;
