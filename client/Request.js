import net from "net";
import ResponseParser from "./ResponseParser.js";

const MIME = {
  form: "application/x-www-form-urlencoded",
  json: "application/json",
};

export default class Request {
  constructor(options) {
    this._options = options;
    this.host = options.host; // Required
    this.port = options.port || 80;
    this.method = options.method || "GET";
    this.path = options.path || "/";
    this.headers = options.headers || {};
    this.headers["Content-Type"] = MIME[options.type];
    this.body = this.bodyFormat(options.body || "");
    this.headers["Content-Length"] = this.body.toString().length;
  }
  send(connection) {
    return new Promise((resolve, reject) => {
      const responseParser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            const httpMessage = this.toString();
            connection.write(httpMessage);
          }
        );
      }
      connection.on("data", (data) => {
        // console.log(
        //   "\n:::connection.on('data'):::\n",
        //   JSON.stringify(data.toString())
        // );
        responseParser.receive(data.toString(), innerCb);
        function innerCb(eventName, data) {
          // :::TODO:::当前是整体返回的，可否做成流式管道（根据不同的content-type）
          if (eventName === "end") {
            resolve(responseParser.response);
            connection.end();
          }
        }
      });
      connection.on("error", (err) => {
        reject(err);
        connection.end();
      });
    });
  }
  // http请求报文的内容
  toString() {
    const headers = Object.keys(this.headers)
      .map((key) => `${key}:${this.headers[key]}`)
      .join("\r\n"); // 换行统一是\r\n
    const message = [
      `${this.method} ${this.path} HTTP/1.1\r\n`,
      `${headers}\r\n\r\n`,
      `${this.body}`,
    ];
    return message.join("");
  }
  // 对请求体进行格式化
  bodyFormat(body) {
    let bodyText;
    // :::TODO:::待补充更多类型
    switch (this.headers["Content-Type"]) {
      case MIME["form"]:
        const keys = Object.keys(body);
        bodyText = keys
          .map((key) => `${key}=${encodeURIComponent(body[key])}`)
          .join("&");
        break;
      case MIME["json"]:
        bodyText = JSON.stringify(body);
        break;
    }
    return bodyText;
  }
}
