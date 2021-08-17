import path from "path";
import fs from "fs";
import jsdom, { JSDOM } from "jsdom";
import { Crawler } from "./Crawler.js";
import { url2filename } from "./tools/util.js";

const filename = import.meta.url.replace("file://", "");
const dirname = path.dirname(filename);
const entryUrl = "https://www.w3.org/TR/?tag=css";
let data = [];

void (async function () {
  const crawler = new Crawler({ type: "css" });
  await crawler.download(entryUrl);
  const content = fs.readFileSync(
    path.resolve(crawler.cachePath, url2filename(entryUrl)),
    "utf-8"
  );
  const entries = crawler.parse(content, getStandards); // 解析TR文档
  await crawler.download(
    entries.map((item) => item.url),
    10
  );

  entries.forEach((entry) => {
    const content = fs.readFileSync(
      path.resolve(crawler.cachePath, url2filename(entry.url)),
      "utf-8"
    );
    data.push(crawler.parse(content, getProperties)); // 解析各个文档
  });
  console.log(data);
  // crawler.view(data, tpl);
})();

// 从TR文档中获取标准来源
export function getStandards(content) {
  const virtualConsole = new jsdom.VirtualConsole();
  const dom = new JSDOM(content, { virtualConsole });

  const elm_container = dom.window.document.getElementById("container");
  const elm_lis = elm_container.children;
  const standards = [];

  for (let i = 0; i < elm_lis.length; i++) {
    const elm_a = elm_lis[i].getElementsByTagName("a")[0] || {};
    const data = elm_lis[i].dataset;
    let standard = {
      title: data["title"],
      tag: data["tag"].split(" "),
      status: data["status"],
      url: elm_a.href,
    };
    // 实施过滤
    if (standard.tag.includes("css")) standards.push(standard);
  }
  return standards;
}

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
  return properties;
}
