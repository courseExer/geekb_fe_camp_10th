const http = require("http");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const archive = archiver("zip", {
  zlib: { level: 9 },
});
const childProcess = require("child_process");
const CONFIG = require("./CONST.js");

async function main() {
  await auth();
  // publish();
}

async function auth() {
  childProcess.exec(
    `open https://github.com/login/oauth/authorize?client_id=${CONFIG.auth.client_id}`
  );
}

function publish() {
  const { PROJ_ROOT } = process.env;
  const { requestConfig, publishDir } = CONFIG;
  const publishDirPath = path.resolve(PROJ_ROOT, publishDir);

  let request = http.request(requestConfig, (response) => {
    let arr = [];
    response
      .on("data", (chunk) => {
        arr.push(Buffer.from(chunk));
      })
      .on("end", () => {
        const result = Buffer.concat(arr).toString("utf-8");
        console.log(result);
      });
  });
  request.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  archive
    .on("warning", (err) => {
      if (err.code === "ENOENT") {
        // log warning
      } else {
        throw err;
      }
    })
    .on("error", (err) => {
      throw err;
    })
    .on("finish", () => {
      request.end();
    });

  archive.pipe(request);
  archive.directory(publishDirPath, false);
  archive.finalize();
}

module.exports = main;
