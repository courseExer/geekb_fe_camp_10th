import { typeIs } from "./utils.js";
export class Component {
  constructor(type) {
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
    this.root.setAttribute(name, value);
  }
  render() {
    throw new Error("需要写render函数");
  }
  mountTo(elm) {
    this.root = this.render().root;
    elm.appendChild(this.root);
    this.componentDidMount();
  }
  appendChild(node) {
    this.root.appendChild(node.root);
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super(type);
    type = type || "div";
    this.root = document.createElement(type);
  }
}

class TextNodeWrapper extends Component {
  constructor(content = "") {
    super();
    this.root = document.createTextNode(content);
  }
}

export function createElement(type, attrs, ...children) {
  let element = null;
  attrs = attrs || {};
  children = children || [];

  if (typeof type === "string") {
    element = new ElementWrapper(type);
  } else {
    element = new type(type);
  }

  for (let attrName in attrs) {
    const attrNameMap = {
      className: "class",
    };
    function getAttrName(name) {
      return Object.keys(attrNameMap).includes(name) ? attrNameMap[name] : name;
    }
    element.setAttribute(getAttrName(attrName), attrs[attrName]);
  }

  function appendElement(children) {
    for (let child of children) {
      if (typeIs(child) === "array") {
        appendElement(child);
        continue;
      }
      if (typeof child === "string") {
        child = new TextNodeWrapper(child);
      }
      element.appendChild(child);
    }
  }
  appendElement(children);

  return element;
}
