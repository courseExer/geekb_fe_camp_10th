export default function layout(element) {
  if (!element.computedStyle) return;
  let elementStyle = getStyle(element);
  if (elementStyle.display !== "flex") return;
  // 过滤，仅保留element
  let items = element.children.filter((e) => e.type === "element");
  // children按各自的order属性进行升序排列
  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0);
  });
  // style的默认值
  let style = elementStyle;
  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === "") {
      style[size] = null;
    }
  });
  if (!style.flexDirection || style.flexDirection === "auto")
    style.flexDirection = "row";
  if (!style.alignItems || style.alignItems === "auto")
    style.alignItems = "stretch";
  if (!style.justifyContent || style.justifyContent === "auto")
    style.justifyContent = "flex-start";
  if (!style.flexWrap || style.flexWrap === "auto") style.flexWrap = "nowrap";
  if (!style.alignContent || style.alignContent === "auto")
    style.alignContent = "stretch";

  // 引入主轴和交叉轴概念
  let mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === "row") {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  } else if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mainStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = 0;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  } else if (style.flexDirection === "column") {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;
    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  } else if (style.flexDirection === "column-reverse") {
    mainSize = "height";
    mainStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = style.height;
    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  } else if (style.flexDirection === "wrap-reverse") {
    let temp = corssStart;
    crossStart = crossEnd;
    crossEnd = temp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }
}

function getStyle(element) {
  if (!element.style) element.style = {};
  for (let prop in element.computedStyle) {
    let p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;
    // 属性值单位为px的，去掉单位
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    // 属性值为纯数字的(含dot)时，向下取整
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}
