const http = require("http");
const fs = require("fs");
const CONFIG = require("./CONST.js");
const path = require("path");

async function publish() {
  const { PROJ_ROOT } = process.env;
  const { requestConfig, publishFilename } = CONFIG;
  let request = http.request(requestConfig, (response) => {
    let arr = [];
    response
      .on("data", (chunk) => {
        arr.push(Buffer.from(chunk));
      })
      .on("end", () => {
        const result = Buffer.concat(arr).toString("utf-8");
        console.log("收到响应", result);
      });
  });
  request.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  let file = fs.createReadStream(
    path.resolve(PROJ_ROOT, "resource", publishFilename)
  );
  file.pipe(request).on("end", (chunk) => {
    request.end(chunk);
    console.log("read-stream结束");
  });
}

module.exports = publish;
