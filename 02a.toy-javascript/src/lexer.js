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

// 词法分析器产出的东西叫做token
// 改为generator后，每次返回一个迭代器iterator，这样外层就可以很容易的使用新语法for of 了
function* scan(str) {
  const regexp = new XRegExp(
    {
      InputElement: "<Whitespace>|<LineTerminator>|<Comments>|<Token>",
      Whitespace: / /,
      LineTerminator: /\n/,
      Comments: /\/\/[^\n]*|\/\*(?:[^*]|[*][^\/])*\*\//,
      Token: "<Literal>|<Keywords>|<Identifier>|<Punctuator>",
      Literal:
        "<NumericLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>",
      NumericLiteral:
        /0x[0-9a-zA-Z]+|0o[0-7]+|0b[01]+|(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
      BooleanLiteral: /true|false/,
      NullLiteral: /null/,
      StringLiteral: /["](?:[^"\n]|\\[\s\S])*["]|['](?:[^'\n]|\\[\s\S])*[']/, // 不理解\\[\s\S]
      Identifier: /[_$a-zA-Z][_$a-zA-Z0-9]*/,
      Keywords:
        /continue|break|if|else|for|function|var|let|const|new|while|return/,
      Punctuator: new RegExp(
        [
          /[\+\*\/\%\=]|\-|\+\+|\-\-|\*\*/.source,
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
    } else if (r.NumericLiteral) {
      yield {
        type: "NumericLiteral",
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
        type: "NullLiteral",
        value: null,
      };
    } else if (r.Identifier) {
      // 为何不沿用value而是name？？
      yield {
        type: "Identifier",
        name: r[0],
      };
    } else if (r.Keywords) {
      // 每一种Keywords都是一个独立的terminal symbol
      yield {
        // type: "Keywords",
        // value: r[0],
        type: r[0],
      };
    } else if (r.Punctuator) {
      // 每一种Punctuator都是一个独立的terminal symbol
      yield {
        // type: "Punctuator",
        // value: r[0],
        type: r[0],
      };
    } else {
      throw new Error("unexpected token ", JSON.stringify(r[0]));
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
