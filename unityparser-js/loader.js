const yaml = require("js-yaml");
const {
  UNITY_TAG_URI,
  OrderedFlowDict,
  UnityClassIdMap,
} = require("./constants");
class UpgradeVersionError extends Error {
  constructor(message, shouldUpgrade = false) {
    super(message);
    this.shouldUpgrade = shouldUpgrade;
  }

  toString() {
    let msg = super.toString();
    if (this.shouldUpgrade) {
      msg = msg.trim();
      msg += msg[msg.length - 1] !== "." ? ". " : " ";
      msg +=
        "This might be an unsupported new Unity version, consider updating this module.";
    }
    return msg;
  }
}

class LoaderVersionError extends UpgradeVersionError {
  constructor(message) {
    super(message, true);
  }
}

class UnityLoader extends yaml.Loader {
  constructor(input, options = {}) {
    super(input, options);
  }
}
function constructUnityClass(loader, tagSuffix, node) {
  try {
    const classid = tagSuffix;
    const classname = node.value[0][0].value;
  } catch (err) {
    throw new LoaderVersionError(`Unknown class id ${tagSuffix}.`);
  }
  const classAttributesNode = node.value[0][1];
  loader.flattenMapping(classAttributesNode);

  const cls = UnityClassIdMap.getOrCreateClassId(classid, classname);
  const anchor = loader.getAnchorFromNode(node);
  const extraAnchorData = loader.getExtraAnchorDataFromNode(anchor);
  const value = new cls(anchor, extraAnchorData);
  value.updateDict(loader.constructMapping(classAttributesNode, true));
  return value;
}

function constructYamlMap(loader, node) {
  const data = new OrderedFlowDict();
  data.setFlowStyle(node.flowStyle);
  const value = loader.constructMapping(node);
  data.update(value);
  return data;
}

UnityLoader.addConstructor("tag:yaml.org,2002:map", constructYamlMap);
UnityLoader.addMultiConstructor(UNITY_TAG_URI, constructUnityClass);

module.exports = { UnityLoader, UpgradeVersionError, LoaderVersionError };
