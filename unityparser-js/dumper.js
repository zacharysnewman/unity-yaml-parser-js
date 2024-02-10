const yaml = require("js-yaml");
const { UNITY_TAG_URI, UnityClass, OrderedFlowDict } = require("./constants");
const uniqstr = require("./constructor");
const { Emitter } = require("./emitter");
const { Representer } = require("./representer");
const { Resolver } = require("./resolver");
const { Serializer } = require("./serializer");
const UNITY_TAG = { "!u!": UNITY_TAG_URI };
const VERSION = [1, 1];

class UnityDumper extends yaml.Type {
  constructor(options) {
    options = options || {};
    options.tags = options.tags || {};
    Object.assign(options.tags, UNITY_TAG);
    options.version = options.version || VERSION;
    super(options);
    Object.assign(this, new Emitter(options));
    Object.assign(this, new Serializer(options));
    Object.assign(this, new Representer(options));
    Object.assign(this, new Resolver(options));
  }
}

function representUnityClass(instance) {
  const data = {
    [instance.constructor.name]: instance.getSerializedPropertiesDict(),
  };
  const node = this.representMapping(
    `${UNITY_TAG_URI}${instance.classId}`,
    data,
    false
  );
  this.anchors[node] = instance.anchor;
  this.extraAnchorData[instance.anchor] = instance.extraAnchorData;
  for (const [key, value] of node.value) {
    this.anchorNode(key);
    this.anchorNode(value);
  }
  return node;
}

function representOrderedFlowDict(instance) {
  return this.representMapping(
    Resolver.DEFAULT_MAPPING_TAG,
    Array.from(instance.entries()),
    { flowStyle: instance.getFlowStyle() }
  );
}

function representNone(instance) {
  return this.representScalar("tag:yaml.org,2002:null", "");
}

function representStr(instance) {
  const style = this.register.pop(instance);
  return this.representScalar("tag:yaml.org,2002:str", instance, {
    style: style,
  });
}

Representer.addMultiRepresenter(UnityClass, representUnityClass);
Representer.addRepresenter(OrderedFlowDict, representOrderedFlowDict);
Representer.addRepresenter(null, representNone);
Representer.addRepresenter(uniqstr, representStr);

module.exports = UnityDumper;
