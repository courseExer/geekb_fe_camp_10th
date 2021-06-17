export class Component {
  constructor(type) {
    type = type || "div";
    this.root = document.createElement(type);
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
    this.root.setAttribute(name, value);
  }
  appendChild(element) {
    element.mountTo(this.root);
  }
  mountTo(dom) {
    dom.appendChild(this.root);
  }
  render() {
    throw new Error("需要写render函数");
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    // super(type);
    this.root = document.createElement(type);
  }
}

class TextNodeWrapper extends Component {
  constructor(content) {
    // super();
    content = content || "";
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
    element.setAttribute(attrName, attrs[attrName]);
  }

  for (let child of children) {
    if (typeof child === "string") child = new TextNodeWrapper(child);
    child.appendChild(element);
  }

  return element;
}
