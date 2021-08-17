import path from "path";
import fs, { mkdir } from "fs";
import https from "https";
import { typeIs, url2filename } from "./tools/util.js";

const filename = import.meta.url.replace("file://", "");
const dirname = path.dirname(filename);

let defaultOptions = {
  type: "",
  cachePath: path.resolve(dirname, "../cache"),
};
export class Crawler {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    this.type = options.type;
    this.cachePath = path.resolve(options.cachePath, this.type);
    this.creatDirectory(this.cachePath);
  }
  creatDirectory(dPath) {
    try {
      fs.accessSync(dPath);
      return;
    } catch (err) {
      mkdir(dPath, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  }
  async download(urls, thread) {
    if (typeIs(urls) === "string") urls = [urls];
    thread = thread || 1;
    let tasks = [];
    for (
      let start = 0, end = thread - 1;
      true;
      start = end + 1, end = start + thread - 1
    ) {
      if (start > urls.length - 1) break;
      if (end > urls.length - 1) end = urls.length - 1;
      tasks.push(urls.slice(start, end + 1));
    }

    while (tasks.length) {
      let task = tasks.shift();
      task = task.map((item) => {
        return this.fetchFile(item);
      });
      await Promise.allSettled(task).then((results) => {
        console.log("done");
        // todo
      });
    }
    console.log("downloaded!");
  }
  fetchFile(url) {
    if (typeof url !== "string" || !url) return;
    const destFileName = url2filename(url);
    const destFilePath = path.resolve(this.cachePath, destFileName);
    return new Promise((resolve, rejects) => {
      try {
        fs.accessSync(destFilePath);
        // console.log(`缓存文件已存在 ${destFilePath}`);
        resolve(destFilePath);
        return;
      } catch (err) {
        console.log(`正在下载 ${destFilePath}`);
      }

      https
        .get(url, (res) => {
          res.pipe(fs.createWriteStream(destFilePath)).on("finish", () => {
            resolve(destFilePath);
          });
        })
        .on("error", (e) => {
          rejects(url);
          console.error(`error: ${e.message}`);
        });
    });
  }
  /** 读取本地文件
   * @param fileName {String}
   * @return {String}
   */
  readCacheFile(fileName) {}
  /** 解析文件
   * @param content {String}
   * @param matcher {Function}
   * @return {Object}
   */
  parse(content, matcher) {
    return matcher(content);
  }
  /** 生成html预览
   * @param data {Object}
   * @param tpl {template}
   * @return {String} htmlString
   */
  generator(data, tpl) {}
}
