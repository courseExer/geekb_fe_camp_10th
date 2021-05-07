import css from "css";
/* Description
 * 之所以使用class来封装text/html解析器是因为，考虑到后续如果要做成流式输出的话，会一个html的内容分多次调用parse，而实例能够保存状态
 */
/* TODO
 * - 规范中识别 DOCTYPE/document,comment,fragments,script,noscript,Text相关
 */

const EOF = Symbol("EOF"); // EOF: End Of File

export class TextHtml {
  constructor() {
    /* 以下为词法分析相关 */
    this.FSM = data;
    // currentTagToken
    // 属性加下划线前缀，避免和attributeName冲突
    this.currentToken = {
      _type: "",
      _tagName: "",
      _isSelfClosing: false,
      _content: "",
    };
    this.currentAttribute = {
      name: "",
      value: "",
    };
    /* 以下为语法分析相关 */
    this.stack = [{ type: "document", children: [] }];
    this.currentTextNode = null;
    this.cssRules = [];
  }
  parse(str) {
    for (let char of str) {
      this.FSM = this.FSM.call(this, char);
    }
    this.FSM = this.FSM(EOF); // 人为结束
    return this.stack[0];
  }
  addCSSRules(declaration) {
    let cssAst = css.parse(declaration);
    this.cssRules.push(...cssAst.stylesheet.rules);
  }
  computedCSS(element) {
    let elements = this.stack.slice().reverse();
    if (!element.computedStyle) element.computedStyle = {};
    for (let rule of this.cssRules) {
      let selectorParts = rule.selectors[0].split(" ").reverse();
      if (!this.matchSelectorPart(element, selectorParts[0])) continue;
      let matched = false,
        j = 1;
      for (let i = 0; i < elements.length; i++) {
        if (this.matchSelectorPart(elements[i], selectorParts[j])) j++;
      }
      if (j >= selectorParts.length) matched = true;
      if (matched) {
        console.log("匹配到的元素：", element, "\n匹配到到规则:", rule);
      }
    }
  }
  matchSelectorPart(element, selectorPart) {}
  emit(token) {
    let top = this.stack[this.stack.length - 1];

    if (token._type === "startTag") {
      let element = {
        type: "element",
        children: [],
        attributes: [],
      };
      element.tagName = token._tagName;

      for (let p in token) {
        if (!["_type", "_tagName"].includes(p)) {
          element.attributes.push({
            name: p,
            value: token[p],
          });
        }
      }
      this.computedCSS(element);
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
        // TODO:[link外联样式表,css中的import语句]
        if (top.tagName === "style") {
          // TODO:[既有文本节点又有元素节点时，]
          this.addCSSRules(top.children[0].content);
        }
        this.stack.pop();
      }
      this.currentTextNode = null;
    } else if (token._type === "text") {
      if (this.currentTextNode === null) {
        this.currentTextNode = {
          type: "text",
          content: "",
        };
        top.children.push(this.currentTextNode);
      }
      this.currentTextNode.content += token._content; // 引用修改
    }
  }
}

/* ==================================================
 * html规范中定义的状态机
 * https://html.spec.whatwg.org/multipage/#toc-syntax
 * ==================================================
 */

// 13.2.5.1 初始状态
// TODO:[&,NULL]
function data(c) {
  if (c === EOF) {
    this.emit({
      _type: "EOF",
    });
    return end; // 词法分析结束
  } else if (c === "<") {
    return tagOpen;
  }
  this.emit({
    _type: "text",
    _content: c,
  });
  return data;
}
// 结束状态
function end() {
  return end;
}
// 13.2.5.6 开标签
// TODO:[!,?]
function tagOpen(c) {
  if (c === EOF) {
    this.emit({
      _type: "text",
      _content: "<",
    });
    this.emit({
      _type: "EOF",
    });
    return end;
  } else if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/) !== null) {
    this.currentToken = {
      _type: "startTag",
      _tagName: "",
    };
    return tagName.call(this, c);
  } else {
    this.emit({
      _type: "text",
      _content: "<",
    });
    return data.call(this, c);
  }
}
// 13.2.5.7 开标签结束
// TODO:[anythingElse]
function endTagOpen(c) {
  if (c === EOF) {
    this.emit({
      _type: "text",
      _content: "</",
    });
    this.emit({
      _type: "EOF",
    });
    return end;
  } else if (c.match(/^[a-zA-Z]$/) !== null) {
    this.currentToken = {
      _type: "endTag",
      _tagName: "",
    };
    return tagName.call(this, c);
  } else if (c === ">") {
    return data;
  } else {
  }
}
// 13.2.5.8 标签名
// TODO:[ASCII_upper_alpha,NULL]
function tagName(c) {
  if (c === EOF) {
    this.emit({
      _type: "EOF",
    });
    return end;
  } else if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName; // 属性名
  } else if (c === "/") {
    return selfClosingStartTag; // 自封闭标签
  } else if (c.match(/^[a-zA-Z]$/)) {
    this.currentToken._tagName += c.toLowerCase();
    return tagName;
  } else if (c === ">") {
    this.emit(this.currentToken);
    return data;
  } else {
    this.currentToken._tagName += c.toLowerCase();
    return tagName;
  }
}
// 13.2.5.32 属性名之前
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (["/", ">", EOF].includes(c)) {
    return afterAttributeName.call(this, c);
  } else if (c === "=") {
    // error：This is an unexpected-equals-sign-before-attribute-name parse error.
    this.currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName;
  }
  this.currentAttribute = {
    name: "",
    value: "",
  };
  return attributeName.call(this, c);
}
// 13.2.5.33 属性名
// TODO:[ASCII_upper_alpha,NULL]
function attributeName(c) {
  if (c.match(/^[\t\n\f\s]$/) || ["/", ">", EOF].includes(c)) {
    return afterAttributeName.call(this, c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (['"', "'", "<"].includes(c)) {
    // This is an unexpected-character-in-attribute-name parse error.
  }
  this.currentAttribute.name += c;
  return attributeName;
}
// 13.2.5.34 属性名后
function afterAttributeName(c) {
  if (c === EOF) {
    this.emit({
      _type: "EOF",
    });
    return end;
  } else if (c.match(/^[\t\n\f\s]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    emit(this.currentToken);
    return data;
  }
  this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
  this.currentAttribute = {
    name: "",
    value: "",
  };
  return attributeName.call(this, c);
}
// 13.2.5.35 属性值前
// 注意：[/,>,EOF]的实现，标准中是没有的
function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f\s]$/) || ["/", ">", EOF].includes(c)) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return attributeValue_doubleQuoted;
  } else if (c === "'") {
    return attributeValue_singleQuoted;
  } else if (c === ">") {
    // This is a missing-attribute-value parse error.
    this.emit(this.currentToken);
    return data;
  }
  return attributeValue_unQuoted.call(this, c);
}
// 13.2.5.37 属性值单引号
// TODO:[&,NULL,]
function attributeValue_singleQuoted(c) {
  if (c === EOF) {
    this.emit({
      _type: "EOF",
    });
    return end;
  } else if (c === "'") {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    return afterAttributeValue_quoted;
  }
  this.currentAttribute.value += c;
  return attributeValue_singleQuoted;
}
// 13.2.5.36 属性值双引号
// TODO:[&,NULL]
function attributeValue_doubleQuoted(c) {
  if (c === EOF) {
    this.emit({
      _type: "EOF",
    });
    return end;
  } else if (c === '"') {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    return afterAttributeValue_quoted;
  }
  this.currentAttribute.value += c;
  return attributeValue_doubleQuoted;
}
// 13.2.5.38 属性值不带引号
// TODO:[&,NULL]
function attributeValue_unQuoted(c) {
  if (c === EOF) {
    this.emit({
      _type: "EOF",
    });
    return end;
  } else if (c.match(/^[\t\n\f\s]$/)) {
    // 标准里没有
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    // 标准里没有
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    emit(this.currentToken);
    return data;
  } else if (["'", '"', "<", "=", "`"]) {
    // This is an unexpected-character-in-unquoted-attribute-value parse error.
  }
  this.currentAttribute.value += c;
  return attributeValue_unQuoted;
}
// 13.2.5.39 属性值引号之后
function afterAttributeValue_quoted(c) {
  if (c === EOF) {
    this.emit({
      _type: "EOF",
    });
    return end;
  } else if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    this.currentToken[this.currentAttribute.name] = this.currentAttribute.value;
    this.emit(this.currentToken);
    return data;
  }
  // This is a missing-whitespace-between-attributes parse error.
  this.currentAttribute.value += c;
  return beforeAttributeName.call(this, c);
}
// 13.2.5.40 开标签自闭合
function selfClosingStartTag(c) {
  if (c === EOF) {
    this.emit({
      _type: "EOF",
    });
    return end;
  } else if (c === ">") {
    this.currentToken._isSelfClosing = true;
    this.emit(this.currentToken);
    return data;
  } else {
    return beforeAttributeName.call(this, c);
  }
}
