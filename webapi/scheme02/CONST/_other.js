/* https://262.ecma-international.org/#sec-global-object */
export function ECMA() {
  const value_properties = ["globalThis", "Infinity", "NaN", "undefined"];
  const function_properties = [
    "eval",
    "isFinite",
    "isNaN",
    "parseFloat",
    "parseInt",
    "Encode",
    "Decode",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
  ];
  const constructor_properties = [
    "Array",
    "ArrayBuffer",
    "BigInt",
    "BigInt64Array",
    "BigUint64Array",
    "Boolean",
    "DataView",
    "Date",
    "Error",
    "EvalError",
    "FinalizationRegistry",
    "Float32Array",
    "Float64Array",
    "Function",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Map",
    "Number",
    "Object",
    "Promise",
    "Proxy",
    "RangeError",
    "ReferenceError",
    "RegExp",
    "Set",
    "SharedArrayBuffer",
    "String",
    "Symbol",
    "SyntaxError",
    "TypeError",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "URIError",
    "WeakMap",
    "WeakRef",
    "WeakSet",
  ];
  const other_properties = ["Atomics", "JSON", "Math", "Reflect"];

  return value_properties
    .concat(...function_properties)
    .concat(...constructor_properties)
    .concat(...other_properties);
}
/* https://html.spec.whatwg.org/#window */
export function WIN() {
  const current_browsing_context = [
    "window",
    "self",
    "document",
    "name",
    "location",
    "history",
    "customElements",
    "locationbar",
    "menubar",
    "personalbar",
    "scrollbars",
    "statusbar",
    "toolbar",
    "status", // deprecated
    "close",
    "closed",
    "stop",
    "focus",
    "blur",
  ];
  const other_browsing_contexts = [
    "frames",
    "length",
    "top",
    "opener",
    "parent",
    "frameElement",
    "open",
  ];
  const the_user_agent = [
    "navigator",
    "clientInformation", // deprecated
    "originAgentCluster",
  ];
  const user_prompts = ["alert", "confirm", "prompt", "print", "postMessage"];
  const medias = [
    "origin",
    "innerWidth",
    "innerHeight",
    "scrollX",
    "pageXOffset",
    "scrollY",
    "pageYOffset",
    "screenX",
    "screenY",
    "outerWidth",
    "outerHeight",
    "devicePixelRatio",
    "offscreenBuffering",
    "screenLeft",
    "screenTop",
    "defaultStatus",
    "defaultstatus",
    "styleMedia",
    "moveBy",
    "moveTo",
    "resizeBy",
    "resizeTo",
    "scroll",
    "scrollBy",
    "scrollTo",
    "screen"
  ];
  return [
    ...current_browsing_context,
    ...other_browsing_contexts,
    ...the_user_agent,
    ...user_prompts,
    ...medias,
  ];
}
/* https://streams.spec.whatwg.org */
export function STREAMS() {
  // TODO
  const readable = [
    "ReadableStream",
    "ReadableStreamDefaultReader",
    "ReadableStreamBYOBReader",
    "ReadableStreamDefaultController",
    "ReadableByteStreamController",
    "ReadableStreamBYOBRequest",
  ];
  const writable = [
    "WritableStream",
    "WritableStreamDefaultWriter",
    "WritableStreamDefaultController",
  ];
  const transform = [
    "TransformStream",
    "TransformStreamDefaultController",
    "ByteLengthQueuingStrategy",
    "CountQueuingStrategy",
  ];
  return [...readable, ...writable, ...transform];
}
