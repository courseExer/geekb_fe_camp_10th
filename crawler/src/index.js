import path from "path";
import { downloadFile, getStandards, getProperties } from "./css.js";

const filename = import.meta.url.replace("file://", "");
const dirname = path.dirname(filename);
const standardUrl = "https://www.w3.org/TR/?tag=css";
const cachePath = path.resolve(path.resolve(dirname, "../cache/css"));

// main
void (async function () {
  let entryPath = path.join(cachePath, "tr.html");
  // download entry html
  await downloadFile(standardUrl, entryPath);
  // 获取standards
  let standards = getStandards(entryPath);
  // download other html
  for (let standard of standards) {
    await downloadFile(
      standard.url,
      path.join(entryPath, "..", standard.title.replace(/\s+/g, "_")) + ".html"
    );
  }
  // 获取每个html中的table.propdef
  let properties = getProperties(
    path.join(cachePath, "css masking module level 1".replace(/\s+/g, "_")) +
      ".html",
    "table.def.propdef"
  );
  console.log(properties);
  console.log("===main end!===");

  // TODO
})();
