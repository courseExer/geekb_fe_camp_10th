class XRegExp {
  constructor(source, flag, root = "root") {
    this.table = new Map();
    this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag);
    console.log("this.regexp:", this.regexp);
    console.log("this.table:", this.table);
  }

  compileRegExp(source, name, start) {
    if (source[name] instanceof RegExp) {
      return {
        source: source[name].source,
        length: 0,
      };
    }
    let length = 0;
    let regexp = source[name].replace(/\<([^>]+)\>/g, (str, $1) => {
      this.table.set(start + length, $1);
      ++length;
      let r = this.compileRegExp(source, $1, start + length);
      length += r.length;
      return "(" + r.source + ")"; // 创建捕获组
    });
    return {
      source: regexp,
      length,
    };
  }
  exec(string) {
    let r = this.regexp.exec(string);
    for (let i = 1; i < r.length; i++) {
      if (r[i] !== void 0) {
        r[this.table.get(i - 1)] = r[i];
      }
    }
    return r;
  }
  get lastIndex() {
    return this.regexp.lastIndex;
  }
  set lastIndex(v) {
    return (this.regexp.lastIndex = v);
  }
}

function* scan(str) {
  const regexp = new XRegExp(
    {
      InputElement: "<Whitespace>|<LineTerminator>|<Comments>|<Token>",
      Whitespace: / /,
      LineTerminator: /\n/,
      Comments: /\/\/[^\n]*|\/\*(?:[^*]|[*][^\/])*\*\//,
      Token: "<Literal>|<Keywords>|<Identifier>|<Punctuator>",
      Literal:
        "<NumbericLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>",
      NumbericLiteral:
        /0x[0-9a-zA-Z]+|0o[0-7]+|0b[01]+|(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
      BooleanLiteral: /true|false/,
      NullLiteral: /null/,
      StringLiteral: /["](?:[^"\n]|\\[\s\S])*["]|['](?:[^'\n]|\\[\s\S])*[']/, // 不理解\\[\s\S]
      Identifier: /[_$a-zA-Z][_$a-zA-Z0-9]*/,
      Keywords: /continue|break|if|else|for|function|var|let|const|new|while/,
      Punctuator: new RegExp(
        [
          /[\+\-\*\/\%\=]|\+\+|\-\-|\*\*/.source,
          /[\(\)\{\}\[\]\<\>]/.source,
          /[\,\;\^\!\~\&\?\:]/.source,
          /\+\=|\-\=|\*\=|\%\=|\&\=|\=\=|\=\=\=|\!\=|\!\=\=|\>\=|\<\=/.source,
          /\=\>|\>\>|\<\<|\>\>\>|\&\&|\?\?|\?\./.source,
          /\.{3}|\./.source, // 有顺序要求
        ].join("|")
      ),
    },
    "g",
    "InputElement"
  );
  while (regexp.lastIndex < str.length) {
    let r = regexp.exec(str);
    if (r.Whitespace) {
    } else if (r.LineTerminator) {
    } else if (r.Comments) {
    } else if (r.NumbericLiteral) {
      yield {
        type: "NumbericLiteral",
        value: r[0],
      };
    } else if (r.BooleanLiteral) {
      yield {
        type: "BooleanLiteral",
        value: r[0],
      };
    } else if (r.StringLiteral) {
      yield {
        type: "StringLiteral",
        value: r[0],
      };
    } else if (r.NullLiteral) {
      yield {
        type: "NumbericLiteral",
        value: null,
      };
    } else if (r.Identifier) {
      yield {
        type: "Identifier",
        value: r[0],
      };
    } else if (r.Keywords) {
      yield {
        type: r[0],
      };
    } else if (r.Punctuator) {
      yield {
        type: r[0],
      };
    } else {
      throw new Error("unexpected token ", r[0]);
    }
    // 退出
    if (!r[0].length) break;
  }
  yield {
    type: "EOF",
  };
}

module.exports = {
  scan,
};
