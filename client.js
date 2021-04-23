import Request from "./client/Request.js";

void (async function () {
  let request = new Request({
    // TCP/IP需要
    host: "127.0.0.1",
    port: 8088,
    // HTTP需要
    method: "POST",
    path: "/abc",
    type: "form",
    headers: {
      Comefrom: "client",
    },
    body: {
      author: "qyingkou",
    },
  });
  // :::TODO:::当前是整体返回的！
  let response = await request.send();
  console.log(":::client,response:::", response);
})();
