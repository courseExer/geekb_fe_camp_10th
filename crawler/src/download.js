import path from "path";
import fs from "fs";
import jsdom, { JSDOM } from "jsdom";
import { Crawler } from "./Crawler.js";
import { url2filename } from "./tools/util.js";

const filename = import.meta.url.replace("file://", "");
const dirname = path.dirname(filename);
const entryUrl = "https://www.w3.org/TR/?tag=css";

void (async function () {
  const crawler = new Crawler({ type: "css" });
  // 下载TR文档
  await crawler.download(entryUrl);
  const content = fs.readFileSync(
    path.resolve(crawler.cachePath, url2filename(entryUrl)),
    "utf-8"
  );
  const entries = crawler.parse(content, getStandards); // 解析TR文档
  // 下载所有标准文档
  await crawler.download(
    entries.map((item) => item.url),
    10
  );
  fs.writeFileSync(
    path.resolve(crawler.cachePath, "result_TR"),
    `${JSON.stringify(entries)}`
  );
})();

// TR文档的解析规则
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
