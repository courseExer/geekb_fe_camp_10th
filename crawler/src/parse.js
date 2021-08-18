import path from "path";
import fs from "fs";
import jsdom, { JSDOM } from "jsdom";
import { Crawler } from "./Crawler.js";
import { url2filename } from "./tools/util.js";

const filename = import.meta.url.replace("file://", "");
const dirname = path.dirname(filename);

let entries = [];
let properties = [];

void (async function () {
  const crawler = new Crawler({ type: "css" });
  const entryPath = path.resolve(crawler.cachePath, "result_TR");
  console.log(entryPath);

  try {
    entries = JSON.parse(fs.readFileSync(entryPath, "utf-8"));
  } catch (e) {
    console.log(`读取错误 ${entryPath}`);
  }

  for (let entry of entries) {
    const cacheFileName = url2filename(entry.url);
    const content = fs.readFileSync(
      path.resolve(crawler.cachePath, cacheFileName),
      "utf-8"
    );
    console.log(`正在解析 ${cacheFileName}`);
    const data = crawler.parse(content, getProperties);
    if (data === null) continue;
    properties.push(data); // 解析各个文档
  }

  fs.writeFileSync(
    path.resolve(crawler.cachePath, "result_props"),
    `${JSON.stringify(properties)}`
  );
})();

export function getProperties(content) {
  const selector = "table.def.propdef";
  const virtualConsole = new jsdom.VirtualConsole();
  const dom = new JSDOM(content, { virtualConsole });
  let properties = {};
  let elm_tables = dom.window.document.body.querySelectorAll(selector);
  // console.log(Object.prototype.toString.call(elm_tables));
  // 解析当前文档中的属性
  for (let i = 0; i < elm_tables.length; i++) {
    const elm_table = elm_tables[i];
    const trs = elm_table.querySelectorAll("tr");
    let kv = [];

    const attrName = elm_table.dataset[Object.keys(elm_table.dataset)[0]];

    for (let j = 0; j < trs.length; j++) {
      const tr = trs[j];
      const th = tr.querySelector("th").innerHTML;
      const td = tr.querySelector("td").innerHTML;

      kv.push({
        key: th.trim().replace(/\n$/, ""),
        value: td.trim().replace(/\n$/, ""),
      });
    }
    properties[attrName] = kv;
  }
  if (Object.keys(properties).length === 0) return null;
  return properties;
}
