import { typeIs } from "../tools/utils.js";
import ChunkedBodyParser from "./bodyParser.js";

export default class ResponseParser {
  constructor() {
    this.statusLine = "";
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
    this.state = null; // 状态机状态
    this.response = {
      httpVersion: NaN,
      statusCode: NaN,
      statusMessage: "",
      headers: {},
      body: null, // any types from Content-type
    };
  }
  // HTTP消息的结构是由\r\n来分割的，这里要做的是拆解http结构
  // 这些字符都属于unicode基本平面（BMP）,与content-Encoding如何编码没有关系
  receive(str, callback) {
    if (this.state === null) {
      this.state = this.getState.call(this, "start");
      this.state = this.state();
    }
    for (let index = 0; index < str.length; index++) {
      const char = str.charAt(index);
      this.state = this.state(char, callback);
    }
  }
  getState(stateName) {
    const map = {
      start(char) {
        return this.getState("waiting_status_line");
      },
      end() {
        return this.getState("end");
      },
      // 状态行处理的状态
      waiting_status_line(char) {
        if (char === "\r") return this.getState("waiting_status_line_end");
        this.statusLine += char;
        return this.getState("waiting_status_line");
      },
      // 状态行换行处理的状态
      waiting_status_line_end(char, outterCb) {
        const [
          httpVersion,
          statusCode,
          ...statusMessage
        ] = this.statusLine.split(" ");
        this.response.httpVersion = httpVersion.split("/")[1];
        this.response.statusCode = statusCode;
        this.response.statusMessage = statusMessage.join(" ");
        // 逐行解析返回
        outterCb("waiting_status_line_end", {
          httpVersion: httpVersion.split("/")[1],
          statusCode,
          statusMessage: statusMessage.join(" "),
        });
        if (char === "\n") return this.getState("waiting_header_name");
        return this.getState("waiting_status_line_end");
      },
      // headers-k处理的状态
      waiting_header_name(char) {
        if (char === ":") return this.getState("waiting_header_space");
        if (char === "\r") return this.getState("waiting_header_block_end");
        this.headerName += char;
        return this.getState("waiting_header_name");
      },
      // headers-kv间的空格的状态
      waiting_header_space(char) {
        if (char === " ") return this.getState("waiting_header_space");
        return this.getState("waiting_header_value").call(this, char); // recomsume
      },
      // headers-v处理的状态
      waiting_header_value(char) {
        if (char === "\r") return this.getState("waiting_header_line_end");
        this.headerValue += char;
        return this.getState("waiting_header_value");
      },
      // header行结束的状态
      waiting_header_line_end(char, outterCb) {
        this.response.headers[this.headerName] = this.headerValue;
        // 逐行解析
        outterCb("waiting_header_line_end", {
          [this.headerName]: this.headerValue,
        });
        this.headerName = "";
        this.headerValue = "";
        return this.getState("waiting_header_name");
      },
      // header块结束的状态
      waiting_header_block_end(char, outterCb) {
        if (char === "\n") {
          this.bodyParser = new ChunkedBodyParser({
            headers: this.response.headers,
          });
          // body的初始值
          if (typeIs(this.response.body) === "null") this.response.body = "";
          outterCb("waiting_header_block_end", null);
          return this.getState("waiting_body");
        }
      },
      // body处理的状态
      waiting_body(char, outterCb) {
        let e = null;
        this.bodyParser.receive(char, innerCb.bind(this));
        function innerCb(eventName, data) {
          switch (eventName) {
            case "waiting_length_line_end":
              this.response.headers["Content-Length"] = +data;
              outterCb(eventName, {
                contentLength: data,
              });
              break;
            case "waiting_content":
              // TODO
              break;
            case "end":
              e = eventName;
              // TODO：需要适配不同的mime
              if (this.response.headers["Content-Type"] === "text/html") {
                this.response.body = data;
              }
              outterCb(eventName, null);
              break;
          }
        }
        return e === "end"
          ? this.getState("end")
          : this.getState("waiting_body");
      },
    };
    return map[stateName];
  }
}
