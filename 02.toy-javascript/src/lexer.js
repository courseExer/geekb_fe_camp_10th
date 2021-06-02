const XRegExp = require("./tools/XRegExp.js");
const { LEXICAL } = require("./const/bnf_lite.js");

/**
 * 词法扫描
 * @param {String} clip 该语言的代码片段
 * @returns {void 0}
 */
function scan(clip) {
  let result = [];
  const regexp = new XRegExp(LEXICAL, "InputElement", "g");
  regexp.lastIndex = -1;
  while (regexp.lastIndex !== 0) {
    const token = regexp.exec(clip);
    if (token === null) continue;

    let matched = token.shift();
    let types = [];
    token.forEach((item, index) => {
      if (item !== void 0) {
        types.push(regexp.sourceMap.get(index));
      }
    });

    let data = {};
    if (types.includes("WhiteSpace")) {
      continue;
    } else if (types.includes("LineTerminator")) {
      continue;
    } else if (types.includes("Comment")) {
      continue;
    } else if (types.includes("NumericLiteral")) {
      const index = types.indexOf("NumericLiteral");
      data = {
        type: "NumericLiteral",
        value: token[index],
      };
    } else if (types.includes("BooleanLiteral")) {
      const index = types.indexOf("BooleanLiteral");
      data = {
        type: "BooleanLiteral",
        value: token[index],
      };
    } else if (types.includes("StringLiteral")) {
      const index = types.indexOf("StringLiteral");
      data = {
        type: "StringLiteral",
        value: token[index],
      };
    } else if (types.includes("NullLiteral")) {
      data = {
        type: "NullLiteral",
        value: null,
      };
    } else if (types.includes("Identifier")) {
      const index = types.indexOf("Identifier");
      data = {
        type: "Identifier",
        value: token[index],
      };
    } else if (types.includes("Keywords")) {
      const index = types.indexOf("Keywords");
      data = {
        name: "Keywords",
        token,
        index,
        type: token[index],
      };
    } else if (types.includes("Punctuator")) {
      const index = types.indexOf("Punctuator");
      data = {
        name: "Punctuator",
        type: token[index],
      };
    } else {
      console.log(token);
      throw new Error("unexpected token:", token);
      continue;
    }
    result.push(data);
  }
  return result;
}

module.exports = { scan };
