const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
class TestInvertedScalarLoading {
  test_inverted_scalar_loading_ok(fixtures, tmpdir) {
    const baseFilePath = path.join(fixtures, "InvertedScalar.dll.meta");
    const doc = yaml.safeLoad(fs.readFileSync(baseFilePath, "utf8"));
    if (doc.PluginImporter.platformData[0].first.Any !== null) {
      throw new Error("Test failed");
    }
  }
}
