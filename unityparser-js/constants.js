const _ = require("lodash");
const lock = require("async-lock")();
class UnityClassIdMap {
  static class_id_map = {};

  static reset() {
    lock.acquire("key", function () {
      UnityClassIdMap.class_id_map = {};
    });
  }

  static get_or_create_class_id(classid, classname) {
    return lock.acquire("key", function () {
      let k = `${classid}-${classname}`;
      let unity_cls = UnityClassIdMap.class_id_map[k];
      if (!unity_cls) {
        unity_cls = class extends UnityClass {
          static class_id = classid;
          static class_name = classname;
        };
        UnityClassIdMap.class_id_map[k] = unity_cls;
      }
      return unity_cls;
    });
  }
}

class UnityClass {
  static class_id = "";
  static class_name = "";

  constructor(anchor, extra_anchor_data) {
    this.anchor = anchor;
    this.extra_anchor_data = extra_anchor_data;
  }

  get_attrs() {
    return _.difference(Object.keys(this), ["anchor", "extra_anchor_data"]);
  }

  update_dict(d) {
    this.__proto__ = Object.assign({}, this.__proto__, d);
  }

  get_serialized_properties_dict() {
    let d = _.cloneDeep(this);
    delete d.anchor;
    delete d.extra_anchor_data;
    return d;
  }
}
class OrderedFlowDict extends Map {
  set_flow_style(flow_style) {
    this.flow_style = flow_style;
  }

  get_flow_style() {
    return this.flow_style;
  }
}

const UNITY_TAG_URI = "tag:unity3d.com,2011:";

module.exports = {
  UnityClassIdMap,
  UnityClass,
  OrderedFlowDict,
  UNITY_TAG_URI,
};
