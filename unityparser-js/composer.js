const yaml = require("js-yaml");
class Composer extends yaml.Composer {
  compose_document() {
    // Drop the DOCUMENT-START event.
    this.get_event();

    // UNITY: used to store data after the anchor
    this.extra_anchor_data = {};

    // Compose the root node.
    const node = this.compose_node(null, null);

    // Drop the DOCUMENT-END event.
    this.get_event();

    // UNITY: prevent reset anchors after document end so we can access them on constructors
    // this.anchors = {};
    return node;
  }

  get_anchor_from_node(node) {
    for (let k in this.anchors) {
      if (node === this.anchors[k]) {
        return k;
      }
    }
    throw new yaml.YAMLException("Expected anchor to be present for node");
  }

  get_extra_anchor_data_from_node(anchor) {
    if (this.extra_anchor_data.hasOwnProperty(anchor)) {
      return this.extra_anchor_data[anchor];
    }
    return "";
  }
}

module.exports = Composer;
