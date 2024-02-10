const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const assert = require("assert");
const tmp = require("tmp");
class TestUnityDocumentSerialization {
  test_single_doc_unchanged(fixtures) {
    const base_file_path = path.join(fixtures, "SingleDoc.asset");
    const doc = yaml.safeLoad(fs.readFileSync(base_file_path, "utf8"));
    const dumped_file_path = tmp.fileSync({ postfix: ".asset" }).name;
    fs.writeFileSync(dumped_file_path, yaml.safeDump(doc));

    assert.strictEqual(
      fs.readFileSync(base_file_path, "utf8"),
      fs.readFileSync(dumped_file_path, "utf8")
    );
  }
  test_multi_doc_unchanged(fixtures) {
    const base_file_path = path.join(fixtures, "MultiDoc.asset");
    const doc = yaml.safeLoad(fs.readFileSync(base_file_path, "utf8"));
    const dumped_file_path = tmp.fileSync({ postfix: ".asset" }).name;
    fs.writeFileSync(dumped_file_path, yaml.safeDump(doc));

    assert.strictEqual(
      fs.readFileSync(base_file_path, "utf8"),
      fs.readFileSync(dumped_file_path, "utf8")
    );
  }
  test_unity_extra_anchor_data(fixtures) {
    const base_file_path = path.join(fixtures, "UnityExtraAnchorData.prefab");
    const doc = yaml.safeLoad(fs.readFileSync(base_file_path, "utf8"));
    const dumped_file_path = tmp.fileSync({ postfix: ".prefab" }).name;
    fs.writeFileSync(dumped_file_path, yaml.safeDump(doc));

    assert.strictEqual(
      fs.readFileSync(base_file_path, "utf8"),
      fs.readFileSync(dumped_file_path, "utf8")
    );
  }
}
class TestUnityDocumentFilters {
  test_filter_entries(fixtures, class_names, attributes, num_entries) {
    const multidoc_path = path.join(fixtures, "MultiDoc.asset");
    const doc = yaml.safeLoad(fs.readFileSync(multidoc_path, "utf8"));
    const entries = doc.filter(
      (entry) =>
        class_names.includes(entry.__proto__.constructor.name) &&
        attributes.every((attr) => entry.hasOwnProperty(attr))
    );
    assert.strictEqual(entries.length, num_entries);
    if (class_names.length)
      assert.strictEqual(
        new Set(entries.map((x) => x.__proto__.constructor.name)),
        new Set(class_names)
      );
    if (attributes.length)
      assert(
        entries.every((x) => attributes.every((attr) => x.hasOwnProperty(attr)))
      );
  }
  test_get_entry(fixtures, class_name, attributes) {
    const multidoc_path = path.join(fixtures, "MultiDoc.asset");
    const doc = yaml.safeLoad(fs.readFileSync(multidoc_path, "utf8"));
    const entry = doc.find(
      (entry) =>
        entry.__proto__.constructor.name === class_name &&
        attributes.every((attr) => entry.hasOwnProperty(attr))
    );

    if (class_name !== null)
      assert.strictEqual(entry.__proto__.constructor.name, class_name);
    if (attributes.length)
      assert(attributes.every((attr) => entry.hasOwnProperty(attr)));
  }
}
