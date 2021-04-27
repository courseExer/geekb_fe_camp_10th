/* todo
 * 当前还没有涉及：
 * - <!DOCTYPE html>,comment,fragments,script,noscript,
 * - 字符的转义或转化
 */

const EOF = Symbol("EOF"); // EOF: End Of File

/* html规范中定义好了状态机
 * https://html.spec.whatwg.org/multipage/#toc-syntax
 */
export class TextHtml {
  constructor() {
    this.FSM = data;
    // 属性加下划线前缀，避免和attributeName冲突
    this.currentToken = {
      _type: "",
      _tagName: "",
      _isSelfClosing: false,
    };
    this.currentAttribute = {
      name: "",
      value: "",
    };
    this.stack = [{ type: "document", children: [] }];
    this.currentTextNode = null;
  }
  parse(str) {
    for (let char of str) {
      this.FSM = this.FSM.call(this, char);
    }
    this.FSM = this.FSM(EOF); // ?
  }
  emit(token) {
    if (token._type === "text") return;
    let top = this.stack[this.stack.length - 1];

    if (token._type === "startTag") {
      let element = {
        type: "element",
        children: [],
        attributes: [],
      };
      element.tagName = token._tagName;

      for (let p in token) {
        if (p !== "_type" || p !== "_tagName") {
          element.attributes.push({
            name: p,
            value: token[p],
          });
        }
      }

      top.children.push(element);
      element.parent = top;

      if (!token._isSelfClosing) {
        this.stack.push(element);
      }

      this.currentTextNode = null;
    } else if (token._type === "endTag") {
      if (top.tagName !== token._tagName) {
        throw new Error("Tag start end doesn't match!");
      } else {
        this.stack.pop();
      }
      this.currentTextNode = null;
    }
  }
}

// 初始状态
function data(c) {
  if (c === "<") {
    return tagOpen;
  }
  if (c === EOF) {
    this.emit({
      type: "EOF",
    });
    return end; // ?
  } else {
    // this.emit({
    //   type: "text",
    //   content: c,
    // });
    return data;
  }
}
// 结束状态
function end() {
  return end;
}
// 开标签
function tagOpen(c) {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/) !== null) {
    this.currentToken = {
      _type: "startTag",
      _tagName: "",
    };
    return tagName.call(this, c);
  } else {
    return;
  }
}
// 开标签结束
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/) !== null) {
    this.currentToken = {
      _type: "endTag",
      _tagName: "",
    };
    return tagName.call(this, c);
  } else if (c === ">") {
  } else if (c === EOF) {
  } else {
  }
}
// 标签名
function tagName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName; // 属性名
  } else if (c === "/") {
    return selfClosingStartTag; // 自封闭标签
  } else if (c.match(/^[a-zA-Z]$/)) {
    this.currentToken._tagName += c.toLowerCase();
    return tagName;
  } else if (c === ">") {
    this.emit(this.currentToken);
    return data; // 开标签结束，重置状态
  } else {
    return tagName; // ？
  }
}
// 开标签自闭合
function selfClosingStartTag(c) {
  if (c === ">") {
    this.currentToken._isSelfClosing = true;
    this.emit(this.currentToken);
    return data;
  } else if (c === EOF) {
  } else {
  }
}
// 属性名
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (["/", ">", EOF].includes(c)) {
    return afterAttributeName.call(this, c);
  } else if (c === "=") {
    // error：属性名之前不应该存在等号
  } else {
    this.currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName.call(this, c);
  }
}
function attributeName(c) {
  if (c.match(/^[\t\n\f\s]$/) || ["/", ">", EOF].includes(c)) {
    return afterAttributeName.call(this, c);
  } else if (c === "=") {
    return beforeAttributeValue;
  }
  // ???
  else if (c === "\u0000") {
    // todo:return some state
  } else if (["\\", "'", "<"].includes(c)) {
    // todo:return some state
  } else {
    this.currentAttribute.name += c;
    return attributeName;
  }
}
function afterAttributeName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    emit(this.currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    this.currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName.call(this, c);
  }
}
function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/) || ["/", ">", EOF].includes(c)) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === ">") {
    // return data;
  } else {
    return unquotedAttributeValue.call(this, c);
  }
}
function singleQuotedAttributeValue(c) {
  if (c === "'") {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    this.currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    this.currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    this.emit(this.currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    this.currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function unquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    emit(this.currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (['"', '"', ">", "=", "`"]) {
  } else if (c === EOF) {
  } else {
    this.currentAttribute.value += c;
    return unquotedAttributeValue;
  }
}
