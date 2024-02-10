const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const glob = require("glob");
const minimist = require("minimist");
const async = require("async");
const diff = require("diff");
const YAML_HEADER = "%YAML";

class UnityProjectTester {
  constructor() {
    this.options = null;
  }

  run() {
    const args = minimist(process.argv.slice(2), {
      string: ["project_path", "exclude", "suffixes"],
      boolean: ["keep_changes", "dry_run"],
      default: {
        keep_changes: false,
        dry_run: false,
        suffixes: ".asset,.unity,.prefab",
      },
    });

    this.options = args;

    this.testNoYamlIsModified();
  }

  testNoYamlIsModified() {
    const projectPath = path.resolve(this.options.project_path);
    const suffixes = this.options.suffixes
      .split(",")
      .map((s) => "." + s.trim("."));
    const assetFilePaths = glob
      .sync(path.join(projectPath, "**/*.*"))
      .filter((p) => suffixes.includes(path.extname(p)));

    console.log(`Found ${assetFilePaths.length} '.asset' files`);

    const validFilePaths = this.options.exclude
      ? assetFilePaths.filter((p) => !new RegExp(this.options.exclude).test(p))
      : assetFilePaths;

    async.mapLimit(
      validFilePaths,
      5,
      (filePath, callback) => this.openAndSave(filePath, callback),
      (err, results) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        const diffFiles = results.filter((r) => r);
        if (diffFiles.length > 0) {
          console.log(`${diffFiles.length} files are different now:`);
          console.log(diffFiles.join("\n"));
        }
      }
    );
  }

  openAndSave(filePath, callback) {
    fs.readFile(filePath, "utf8", (err, fileContent) => {
      if (err) return callback(err);

      if (!fileContent.startsWith(YAML_HEADER)) {
        console.log(`Ignoring non-yaml file ${filePath}`);
        return callback(null, null);
      }

      console.log(`Processing ${filePath}`);

      let doc;
      try {
        doc = yaml.safeLoad(fileContent);
      } catch (e) {
        return callback(e);
      }

      if (this.options.dry_run) {
        return callback(null, null);
      }

      const newYamlContent = yaml.safeDump(doc);
      const isDifferent = diff
        .diffLines(fileContent, newYamlContent)
        .some((part) => part.added || part.removed);

      if (isDifferent && !this.options.keep_changes) {
        fs.writeFile(filePath, fileContent, "utf8", (err) =>
          callback(err, isDifferent ? filePath : null)
        );
      } else {
        callback(null, isDifferent ? filePath : null);
      }
    });
  }
}
new UnityProjectTester().run();
