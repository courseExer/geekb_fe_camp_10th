import * as mdn from "./CONST.js";
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
  globalProps = globalProps.filter((name) => {
    if (name === "VirtualKeyboard") return false;
    if (/keyboard/i.test(name)) return false;
    return true;
  });
}
// "InputDeviceCapabilities"
// https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceCapabilities_API#specifications
{
  console.log("\n---InputDeviceCapabilities---");
  globalProps = globalProps.filter((name) => {
    if (name === "InputDeviceCapabilities") return false;
    return true;
  });
}
// mdn的webapi按规范进行分类
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

// Trusted Types
{
  console.log("\n---Trusted Types---");
  const foo = [
    "TrustedHTML",
    "TrustedScript",
    "TrustedScriptURL",
    "TrustedTypePolicy",
    "TrustedTypePolicyFactory",
  ];
  globalProps = globalProps.filter((name) => {
    return foo.includes(name) ? false : true;
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

// 待分类,按关键字
{
  console.log("\n---browser,by apiName---");
  const known = [
    "escape", // deprecated
    "unescape", // deprecated
    "FormData",
    "Option",
    "external", // deprecated
    "ElementInternals",
    "CompressionStream",
    "DecompressionStream",
    "atob",
    "btoa",
    "cancelAnimationFrame",
    "cancelIdleCallback",
    "createImageBitmap",
    "find",
    "getComputedStyle",
    "getSelection",
    "matchMedia",
    "queueMicrotask",
    "requestAnimationFrame",
    "requestIdleCallback",
    "setInterval",
    "setTimeout",
    "clearInterval",
    "clearTimeout",
    "caches",
    "WebAssembly",
    "Worklet",
  ];
  const unknown = [
    "chrome",
    "trustedTypes",
    "isTrusted",
    "isSecureContext",
    "LargestContentfulPaint",
    "NavigatorUAData",
    "LockManager",
    "Lock",
    "UserActivation", // navigator.userActivation instanceof UserActivation // true
    "FeaturePolicy", // document.featurePolicy
    "GetParams",
    "NavigatorManagedData",
    "FragmentDirective", // document.fragmentDirective
    "Serial",
    "SerialPort",
    "crossOriginIsolated",
    "DelegatedInkTrailPresenter",
    "Ink",
    "_typeof2",
  ];
  const total = known.concat(...unknown);
  globalProps = globalProps.filter((name) => {
    return total.includes(name) ? false : true;
  });
}

// 待分类，按正则
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
    /^__.+__$/i, // chrome extensions
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