import path from "path";
import fs from "fs";

import { Crawler } from "./Crawler.js";
import { url2filename } from "./tools/util.js";

const filename = import.meta.url.replace("file://", "");
const dirname = path.dirname(filename);
let properties = [];

void (async function () {
  // todo:生成一个属性表格
  console.log("hello view");
})();
