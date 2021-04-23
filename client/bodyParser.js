/* 可以读取chunked和non-chunked这两种报文体里的内容 */

export default class ChunkedBodyParser {
  constructor(options) {
    this._options = options;
    this.state = null;
    this.length = options.headers["Content-Length"] || 0;
    this.content = null; // any
  }
  getState(stateName) {
    const map = {
      start(char, outterCb) {
        // chunk类型的报文
        if (
          this._options.headers["Transfer-Encoding"] === "chunked" &&
          this._options.headers["Content-Length"] === void 0
        ) {
          this.convertLength(16);
          return this.getState("waiting_length_line");
        }
        // non-chunk类型的报文
        outterCb("waiting_length_line_end", this.length);
        return this.getState("waiting_content");
      },
      end() {
        return this.getState("end");
      },
      waiting_length_line(char) {
        if (char === "\r") {
          return this.getState("waiting_length_line_end");
        }
        this.length += char;
        return this.getState("waiting_length_line");
      },
      waiting_length_line_end(char, outterCb) {
        if (char === "\n") {
          this.convertLength(16);
          outterCb("waiting_length_line_end", this.length);
          return this.getState("waiting_content");
        }
        throw new Error("chunkedBody的length解析错误");
      },
      // TODO:需按照Content-Type,设置不同的返回方案
      waiting_content(char, outterCb) {
        if (this._options.headers["Content-Type"] === "text/html") {
          if (this.content === null) this.content = "";
          this.length > 0 && this.length--;
          this.content += char;
        }
        if (this.length === 0) {
          outterCb("end", this.content);
          return this.getState("end");
        }
        return this.getState("waiting_content");
      },
    };
    return map[stateName];
  }
  receive(char, outterCb) {
    if (this.state === null) {
      this.state = this.getState("start").call(this, char, outterCb);
      outterCb("waiting_length_line_end", this.length);
    }
    this.state = this.state(char, outterCb);
  }
  // 数值的进制转换
  convertLength(base) {
    return (this.length = parseInt(this.length, base));
  }
}
