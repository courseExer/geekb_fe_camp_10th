const http = require("http");
const https = require("https");
const path = require("path");
const unzipper = require("unzipper");
const { deserializeUrl } = require("./utils.js");

let githubConfig = {
  client_id: "Iv1.8f4cf9203734e6e8",
  client_secret: "39d92f000b921f50c6c488dfd6b67c4afdddb9f0",
};

function main() {
  start();
}

function start() {
  const server = http.createServer((req, res) => {
    const {
      pathname,
      searchParams: { code },
    } = deserializeUrl(req);
    Object.assign(githubConfig, { code });

    if (pathname === "/auth") {
      getAccessToken();
    }

    if (pathname === "/deploy") {
      deploy(req, res);
    }
  });
  server.listen(8000, () => {
    console.log("publishServer started at 8000 port!");
  });
}

function getAccessToken() {
  const postData = githubConfig;
  const options = {
    method: "POST",
    port: 443,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(postData)),
    },
  };

  let request = https.request(
    "https://github.com/login/oauth/access_token",
    options,
    (response) => {
      let result = "";
      // response.setEncoding("utf8");
      response.on("data", (chunk) => {
        result += chunk.toString("utf8");
      });
      response.on("end", () => {
        result = JSON.parse(result);
        console.log("githubConfig:", githubConfig);
        console.log("access_token:", result.access_token);
      });
    }
  );
  request.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  request.write(JSON.stringify(postData));
  request.end();
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
