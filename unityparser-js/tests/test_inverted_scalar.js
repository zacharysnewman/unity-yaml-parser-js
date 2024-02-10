const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { expect } = require("@jest/globals");

test("test_inverted_scalar_loading_ok", () => {
  const fixtures = "./fixtures";
  const baseFilePath = path.join(fixtures, "InvertedScalar.dll.meta");
  const doc = yaml.safeLoad(fs.readFileSync(baseFilePath, "utf8"));
  expect(doc.PluginImporter.platformData[0].first.Any).toBeNull();
});
