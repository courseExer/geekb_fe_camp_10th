const http = require("http");
const path = require("path");
const unzipper = require("unzipper");

function main() {
  start();
}

function start() {
  const server = http.createServer((req, res) => {
    deploy(req, res);
  });
  server.listen(8000, () => {
    console.log("publishServer started at 8000 port!");
  });
}

function deploy(req, res) {
  const { PROJ_ROOT } = process.env;
  const serverPath = path.resolve(PROJ_ROOT, "../server");
  const deployDirectory = path.resolve(serverPath, "public");
  req.pipe(unzipper.Extract({ path: deployDirectory }));
  req.on("end", () => {
    const timeString = new Date().toLocaleTimeString();
    const message_server = `部署成功 ${timeString}`;
    const message_client = `发布成功 ${timeString}`;
    res.writeHead(200, "ok", {
      "Content-Type": "text/plain",
    });
    res.end(message_client);
    console.log(message_server);
  });
}

module.exports = main;
