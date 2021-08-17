import fs from "fs";
import https from "https";
import jsdom, { JSDOM } from "jsdom";

// 下载网页内容
export function downloadFile(resUrl, destFilePath) {
  return new Promise((resolve, rejects) => {
    try {
      fs.accessSync(destFilePath);
      // console.log(`缓存已存在跳过下载 ${destFilePath}`);
      resolve();
      return;
    } catch (err) {
      console.log(`正在下载 ${destFilePath}`);
    }

    https
      .get(resUrl, (res) => {
        res.pipe(fs.createWriteStream(destFilePath)).on("finish", () => {
          resolve();
        });
      })
      .on("error", (e) => {
        rejects();
        console.error(`error: ${e.message}`);
      });
  });
}

// 提取css-standards数据，过滤掉非css的项
export function getStandards(cacheFile) {
  const doc = fs.readFileSync(cacheFile, "utf-8");
  const virtualConsole = new jsdom.VirtualConsole();
  const dom = new JSDOM(doc, { virtualConsole });

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

export function getProperties(cacheFile, selector) {
  const doc = fs.readFileSync(cacheFile, "utf-8");
  const virtualConsole = new jsdom.VirtualConsole();
  const dom = new JSDOM(doc, { virtualConsole });
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

export function camelCaseConvert(variableName, delimiter) {
  const reg_delimiter = /[-_]/g;
  const reg_upperCase = /[A-Z]/g;
  let mode = reg_delimiter.test(delimiter) ? "delimiter" : "upperCase";

  if ((mode = "upperCase")) {
    if (reg_upperCase.test(variableName)) return variableName;
    let tmp = variableName.split(reg_delimiter).map((word, index) => {
      let first = word.slice(0, 1);
      const rest = word.slice("1");
      if (index !== 0) first = first.toUpperCase();
      return first + rest;
    });
    return tmp.join("");
  } else {
    // todo
  }
}
