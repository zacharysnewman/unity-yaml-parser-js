const fs = require("fs");
const yaml = require("js-yaml");
class TestScalarValueTypes {
  test_types(fixtures) {
    let base_file_path = fixtures["MultipleTypesDoc.asset"];
    let doc = yaml.safeLoad(fs.readFileSync(base_file_path, "utf8"));
    let multi_types = doc.entry;

    let count_map = { int: 0, str: 0, float: 0 };

    function evaluate_type(attr, parent_map) {
      let attr_value = parent_map[attr];
      let split_attr = attr.split("_");
      if (split_attr[0] === "scalar") {
        let expected_type = split_attr[1];
        assert(typeof attr_value === expected_type);
        count_map[expected_type]++;
      } else if (split_attr[0] === "map") {
        for (let k in attr_value) {
          evaluate_type(k, attr_value);
        }
      }
    }

    let multi_types_attr_map = multi_types;
    for (let attribute in multi_types_attr_map) {
      evaluate_type(attribute, multi_types_attr_map);
    }

    assert(count_map["int"] === 4);
    assert(count_map["str"] === 8);
    assert(count_map["float"] === 6);
  }

  test_sum_int_type(fixtures) {
    let base_file_path = fixtures["MultipleTypesDoc.asset"];
    let doc = yaml.safeLoad(fs.readFileSync(base_file_path, "utf8"));
    let multi_types = doc.entry;

    multi_types.scalar_int_001 += 1;
    assert(multi_types.scalar_int_001 === 16);
  }
}
