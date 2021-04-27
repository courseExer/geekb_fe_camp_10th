import Request from "./client/Request.js";
import { TextHtml } from "./client/contentParser.js";

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
      myrequestheader: "client",
    },
    body: {
      who: "client",
    },
  });
  // 当前是整体返回的！
  // :::TODO:::根据content-type为文本型时，一段段返回
  let response = await request.send();
  console.log(":::client,response:::", response);
  const htmlParser = new TextHtml();
  let dom = htmlParser.parse(response.body);
  console.log(dom);
})();
