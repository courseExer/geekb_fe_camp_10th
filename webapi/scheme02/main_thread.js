import * as mdn from "./CONST.js";
import { Streams } from "./CONST.js";
import { ECMA, WIN, STREAMS } from "./CONST/_other.js";

let globalProps = Object.getOwnPropertyNames(window);
console.log("window的自身属性数量:", globalProps.length);

// webkit prefix
{
  console.log("\n---webkit---");
  globalProps = globalProps.filter((name) => {
    return name.match(/^webkit/i) ? false : true;
  });
}

// ECMA 262
{
  console.log("\n---ECMA262---");
  const properties = ECMA();
  globalProps = globalProps.filter((name) => {
    return properties.includes(name) ? false : true;
  });
}

// whatwg - window
{
  console.log("\n---window-object---");
  const properties = WIN();
  globalProps = globalProps.filter((name) => {
    return properties.includes(name) ? false : true;
  });
}

// whatwg - stream
{
  console.log("\n---stream---");
  const properties = STREAMS();
  globalProps = globalProps.filter((name) => {
    return properties.includes(name) ? false : true;
  });
}

// event - on
{
  console.log("\n---onEvent---");
  globalProps = globalProps.filter((name) => {
    return name.match(/^on/) ? false : true;
  });
}

// Intl
// https://402.ecma-international.org/5.0/#intl-object
{
  console.log("\n---Intl---");
  globalProps = globalProps.filter((item) => item !== "Intl");
}
// "VirtualKeyboard"
// https://www.w3.org/TR/virtual-keyboard/#the-virtualkeyboard-interface
{
  console.log("\n---VirtualKeyboard---");
  delete globalProps.VirtualKeyboard;
}
// "InputDeviceCapabilities"
// https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceCapabilities_API#specifications
{
  console.log("\n---InputDeviceCapabilities---");
  delete globalProps.InputDeviceCapabilities;
}
// mdn的webapi整理！
{
  console.log("\n---mdn的webapi规范---");
  const keys = Object.keys(mdn);
  let properties = [];
  keys.forEach((key) => {
    const props = mdn[key].map((item) => item.name.trim());
    properties.push(...props);
  });
  globalProps = globalProps.filter((name) => {
    return properties.includes(name) ? false : true;
  });
}

// web components
{
  console.log("\n---webcomponents---");
  const Custom_elements = ["CustomElementRegistry", "customElements"];
  const Shadow_DOM = ["ShadowRoot", "DocumentOrShadowRoot"];
  globalProps = globalProps.filter((name) => {
    return Custom_elements.includes(name) ? false : true;
  });
  globalProps = globalProps.filter((name) => {
    return Shadow_DOM.includes(name) ? false : true;
  });
}

// nodetree 拾遗
{
  console.log("\n---nodetree 拾遗---");
  const foo = ["Image", "HTMLDocument"];

  globalProps = globalProps.filter((name) => {
    return foo.includes(name) ? false : true;
  });
}

// xml 拾遗
{
  console.log("\n---xml 拾遗---");
  const foo = [
    "XPathResult",
    "XPathExpression",
    "XPathEvaluator",
    "XMLSerializer",
    "XSLTProcessor",
  ];

  globalProps = globalProps.filter((name) => {
    return foo.includes(name) ? false : true;
  });
}

// 浏览器提供（实现）的功能
{
  console.log("\n---browser,by apiName---");
  const foo = [
    "alert",
    "confirm",
    "cookieStore",
    "CookieStore",
    "CookieStoreManager",
    "WebAssembly",
    "Worklet",
    "ResizeObserverSize",
    "ReportingObserver",
    "TrustedHTML",
    "TrustedScript",
    "TrustedScriptURL",
    "TrustedTypePolicy",
    "TrustedTypePolicyFactory",
    "isTrusted",
    "isSecureContext",
    "escape", // deprecated
    "unescape", // deprecated
    "LargestContentfulPaint",
    "PerformanceServerTiming",
    "PerformancePaintTiming",
    "PerformanceObserverEntryList",
    "PerformanceElementTiming",
    "FormData",
    "Option",
    "external", // deprecated
    "ElementInternals",
    "CompressionStream",
    "DecompressionStream",
  ];

  globalProps = globalProps.filter((name) => {
    return foo.includes(name) ? false : true;
  });
}

// 其他过滤，按关键字
{
  console.log("\n---other，by regexp---");
  const regExps = [
    /XMLHttpRequest/i,
    /XR/i,
    /Error/i,
    /Event/i,
    /USB/i,
    /DOM/i,
    /^WebTransport/i,
    /^VTT/i,
  ];
  globalProps = globalProps.filter((name) => {
    for (let regExp of regExps) {
      if (regExp.test(name)) return false;
    }
    return true;
  });
}
console.log("window的自身属性还剩下:", globalProps.length);
console.dir(globalProps);
window.globalProps = globalProps;
