const fs = require("fs");
const path = require("path");
const { UnityClassIdMap } = require("./UnityClassIdMap");
let fixtures = () => {
  let fixturesFolder = path.join(__dirname, "fixtures");
  let fixturesDict = {};
  fs.readdirSync(fixturesFolder).forEach((file) => {
    fixturesDict[file] = path.resolve(fixturesFolder, file);
  });
  return fixturesDict;
};

let resetUnityClassIdMap = () => {
  UnityClassIdMap.reset();
};

module.exports = {
  fixtures,
  resetUnityClassIdMap,
};
