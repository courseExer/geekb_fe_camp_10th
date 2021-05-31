const { XRegExp } = require("../tools/utils.js");
const { LEXICAL } = require("./langSpecification.js");

describe(":::准备:::", () => {
  test("compileRegExp函数的返回值", () => {
    const regexp = new XRegExp(LEXICAL, "InputElement");
    expect(regexp instanceof RegExp).toBeTruthy;
  });
  test("LEXICAL的数据类型", () => {
    expect(LEXICAL instanceof Object).toBeTruthy;
  });
});

describe(":::WhiteSpace:::", () => {
  const regexp = new XRegExp(LEXICAL, "WhiteSpace","u");
  test("yes", () => {
    [
      String.fromCodePoint(0x0009), // TAB
      "\t",
      String.fromCodePoint(0x000b), // VT
      "\v",
      String.fromCodePoint(0x000c), // FF
      String.fromCodePoint(0x0020), // SP
      " ",
      String.fromCodePoint(0x00a0), // NBSP
      String.fromCodePoint(0xfeff), // ZWNBSP
      String.fromCodePoint(0x200a), // USP_200A
      String.fromCodePoint(0x3000), // USP_3000
    ].forEach((item) => {
      expect(item).toMatch(regexp);
    });
  });
});

describe(":::LineTerminator:::", () => {
  const regexp = new XRegExp(LEXICAL, "LineTerminator","u");
  test("yes", () => {
    [
      String.fromCodePoint(0x000a), // LF
      "\n",
      String.fromCodePoint(0x000d), // CR
      "\r",
      String.fromCodePoint(0x2028), // LS
      String.fromCodePoint(0x2029), // PS
    ].forEach((item) => {
      expect(item).toMatch(regexp);
    });
  });
});

describe(":::Comment:::", () => {
  const regexpSource = compileRegExp(LEXICAL, "Comment");
  const regexp = new RegExp(regexpSource);
  test("Comment-SingleLineComment", () => {
    [`//`, `// `, `//1`].forEach((item) => {
      expect(item).toMatch(new RegExp(regexp));
    });
  });
  test("Comment-MultipleLineComment", () => {
    [`/**/`, `/***/ `, `/**1*/`, `/**/*/`].forEach((item) => {
      expect(item).toMatch(new RegExp(regexp));
    });
  });
});

describe(":::CommonToken-Keywords:::", () => {
  const regexpSource = compileRegExp(LEXICAL, "Keywords");
  test("yes", () => {
    [
      "await",
      "break",
      "case",
      "catch",
      "class",
      "const",
      "continue",
      "debugger",
      "default",
      "delete",
      "do",
      "else",
      "enum",
      "export",
      "extends",
      "false",
      "finally",
      "for",
      "function",
      "if",
      "import",
      "in",
      "instance",
      "of",
      "new",
      "null",
      "return",
      "super",
      "switch",
      "this",
      "throw",
      "true",
      "try",
      "typeof",
      "var",
      "void",
      "while",
      "with",
      "yield",
    ].forEach((item) => {
      expect(item).toMatch(new RegExp(regexpSource));
    });
  });

  describe(":::CommonToken--OptionalChainingPunctuator:::", () => {
    const regexpSource = compileRegExp(LEXICAL, "OptionalChainingPunctuator");
    test("no", () => {
      ["?.0", "?.9"].forEach((item) => {
        expect(item).not.toMatch(new RegExp(regexpSource));
      });
    });
    test("yes", () => {
      [
        "?.~",
        "?.!",
        "?.@",
        "?.#",
        "?.$",
        "?.%",
        "?.^",
        "?.&",
        "?.*",
        "?.(",
        "?.)",
        "?.-",
        "?._",
        "?.=",
        "?.+",
        "?.a",
        "?.a1",
      ].forEach((item) => {
        expect(item).toMatch(new RegExp(regexpSource));
      });
    });

    describe(":::CommonToken--OtherPunctuator:::", () => {
      const regexpSource = compileRegExp(LEXICAL, "OtherPunctuator");
      test("no", () => {
        ["。", "_", "a", "1"].forEach((item) => {
          expect(item).not.toMatch(new RegExp(regexpSource));
        });
      });
      test("yes", () => {
        [
          "{",
          "}",
          "(",
          ")",
          "[",
          "]",
          ".",
          "...",
          ";",
          ",",
          "<",
          ">",
          "<=",
          ">=",
          "==",
          "!=",
          "===",
          "!==",
          "+",
          "-",
          "*",
          "/",
          "%",
          "/=",
          "**",
          "++",
          "--",
          "<<",
          ">>",
          ">>>",
          "&",
          "^",
          "!",
          "~",
          "&",
          "?",
          ":",
          "=",
          "&&",
          ",,",
          "??",
          "+=",
          "-=",
          "*=",
          "%=",
          "**=",
          "<<=",
          ">>=",
          ">>>=",
          "&=",
          "|=",
          "^=",
          "=>",
        ].forEach((item) => {
          expect(item).toMatch(new RegExp(regexpSource));
        });
      });
    });
  });
});

describe(":::CommonToken--IdentifierName:::", () => {
  const regexpSource = compileRegExp(LEXICAL, "IdentifierName");
  test("no", () => {
    ["0", ""].forEach((item) => {
      expect(item).not.toMatch(new RegExp(regexpSource));
    });
  });
  test("yes", () => {
    ["id", "idName", "id_name", "idName0", "id_name_0", "_", "$", "$0"].forEach(
      (item) => {
        expect(item).toMatch(new RegExp(regexpSource));
      }
    );
  });
});

describe(":::CommonToken--BooleanLiteral:::", () => {
  const regexpSource = compileRegExp(LEXICAL, "BooleanLiteral");
  test("no", () => {
    [1, "a"].forEach((item) => {
      expect(new RegExp(regexpSource).test(item)).toBeFalsy();
    });
  });
  test("yes", () => {
    [true, false, !0, !!0].forEach((item) => {
      expect(new RegExp(regexpSource).test(item)).toBeTruthy();
    });
  });
});

describe(":::CommonToken--NullLiteral:::", () => {
  const regexpSource = compileRegExp(LEXICAL, "NullLiteral");
  test("no", () => {
    [void 0, NaN, false].forEach((item) => {
      expect(new RegExp(regexpSource).test(item)).toBeFalsy();
    });
  });
  test("yes", () => {
    [null].forEach((item) => {
      expect(new RegExp(regexpSource).test(item)).toBeTruthy();
    });
  });
});

describe(":::CommonToken--StringLiteral:::", () => {
  const regexpSource = compileRegExp(LEXICAL, "StringLiteral");
  test("yes", () => {
    ['"a"', "'b'"].forEach((item) => {
      expect(new RegExp(regexpSource).test(item)).toBeTruthy();
    });
  });
});

describe(":::CommonToken--NumericLiteral:::", () => {
  const regexpSource = compileRegExp(LEXICAL, "NumericLiteral");
  test("no", () => {
    ["null", "NaN"].forEach((item) => {
      expect(new RegExp(regexpSource).test(item)).toBeFalsy();
    });
  });
  test("yes", () => {
    ["0", "1", "100", "0.1", ".1"].forEach((item) => {
      expect(new RegExp(regexpSource).test(item)).toBeTruthy();
    });
  });
});
