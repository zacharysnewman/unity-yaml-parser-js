const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const tmp = require("tmp");

describe("TestUnityDocumentSerialization", () => {
  it("test_single_doc_unchanged", () => {
    const base_file_path = path.join(fixtures, "SingleDoc.asset");
    const doc = yaml.safeLoad(fs.readFileSync(base_file_path, "utf8"));
    const dumped_file_path = tmp.fileSync({ postfix: ".asset" }).name;
    fs.writeFileSync(dumped_file_path, yaml.safeDump(doc));

    expect(fs.readFileSync(base_file_path, "utf8")).toEqual(
      fs.readFileSync(dumped_file_path, "utf8")
    );
  });

  it("test_multi_doc_unchanged", () => {
    const base_file_path = path.join(fixtures, "MultiDoc.asset");
    const doc = yaml.safeLoad(fs.readFileSync(base_file_path, "utf8"));
    const dumped_file_path = tmp.fileSync({ postfix: ".asset" }).name;
    fs.writeFileSync(dumped_file_path, yaml.safeDump(doc));

    expect(fs.readFileSync(base_file_path, "utf8")).toEqual(
      fs.readFileSync(dumped_file_path, "utf8")
    );
  });

  it("test_unity_extra_anchor_data", () => {
    const base_file_path = path.join(fixtures, "UnityExtraAnchorData.prefab");
    const doc = yaml.safeLoad(fs.readFileSync(base_file_path, "utf8"));
    const dumped_file_path = tmp.fileSync({ postfix: ".prefab" }).name;
    fs.writeFileSync(dumped_file_path, yaml.safeDump(doc));

    expect(fs.readFileSync(base_file_path, "utf8")).toEqual(
      fs.readFileSync(dumped_file_path, "utf8")
    );
  });
});

describe("TestUnityDocumentFilters", () => {
  it("test_filter_entries", () => {
    const multidoc_path = path.join(fixtures, "MultiDoc.asset");
    const doc = yaml.safeLoad(fs.readFileSync(multidoc_path, "utf8"));
    const entries = doc.filter(
      (entry) =>
        class_names.includes(entry.__proto__.constructor.name) &&
        attributes.every((attr) => entry.hasOwnProperty(attr))
    );
    expect(entries.length).toEqual(num_entries);
    if (class_names.length)
      expect(new Set(entries.map((x) => x.__proto__.constructor.name))).toEqual(
        new Set(class_names)
      );
    if (attributes.length)
      expect(
        entries.every((x) => attributes.every((attr) => x.hasOwnProperty(attr)))
      ).toBeTruthy();
  });

  it("test_get_entry", () => {
    const multidoc_path = path.join(fixtures, "MultiDoc.asset");
    const doc = yaml.safeLoad(fs.readFileSync(multidoc_path, "utf8"));
    const entry = doc.find(
      (entry) =>
        entry.__proto__.constructor.name === class_name &&
        attributes.every((attr) => entry.hasOwnProperty(attr))
    );

    if (class_name !== null)
      expect(entry.__proto__.constructor.name).toEqual(class_name);
    if (attributes.length)
      expect(
        attributes.every((attr) => entry.hasOwnProperty(attr))
      ).toBeTruthy();
  });
});
