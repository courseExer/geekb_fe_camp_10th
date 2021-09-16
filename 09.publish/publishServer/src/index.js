const http = require("http");
const fs = require("fs");
const path = require("path");

async function main() {
  await env();
  deploy();
}

function deploy() {
  const { PROJ_ROOT } = process.env;
  const serverPath = path.resolve(PROJ_ROOT, "../server");
  const filePath = path.resolve(serverPath, "public/index.html");

  const server = http.createServer((req, res) => {
    let file = fs.createWriteStream(filePath);

    file.on("finish", () => {
      const { size } = fs.statSync(filePath);
      const message = `文件大小为${size}个字节`;
      res.writeHead(200, "ok", {
        "Content-Type": "text/plain",
      });
      res.end(message);
      console.log(new Date().toLocaleTimeString(), ",finished");
    });
    req.pipe(file).on("end", (chunk) => {
      file.end(chunk);
    });
  });
  server.listen(8000, () => {
    console.log("publishServer started at 8000 port!");
  });
}

module.exports = deploy;
