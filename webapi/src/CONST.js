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
export function WINDOW() {
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

  return [
    ...current_browsing_context,
    ...other_browsing_contexts,
    ...the_user_agent,
  ];
}
/* https://html.spec.whatwg.org/#all-interfaces */
export function INTERFACE() {
  return [
    "AudioTrack",
    "AudioTrackList",
    "BarProp",
    "BeforeUnloadEvent",
    "BroadcastChannel",
    "CanvasGradient",
    "CanvasPattern",
    "CanvasRenderingContext2D",
    "CloseEvent",
    "CustomElementRegistry",
    "DOMParser",
    "DOMStringList",
    "DOMStringMap",
    "DataTransfer",
    "DataTransferItem",
    "DataTransferItemList",
    "DedicatedWorkerGlobalScope",
    "Document",
    "DragEvent",
    "ElementInternals",
    "ErrorEvent",
    "EventSource",
    "External", //deprecated
    "FormDataEvent",
    "HTMLAllCollection",
    "HTMLAnchorElement",
    "HTMLAreaElement",
    "HTMLAudioElement",
    "HTMLBRElement",
    "HTMLBaseElement",
    "HTMLBodyElement",
    "HTMLButtonElement",
    "HTMLCanvasElement",
    "HTMLDListElement",
    "HTMLDataListElement",
    "HTMLDetailsElement",
    "HTMLDialogElement",
    "HTMLDirectoryElement", //deprecated
    "HTMLDivElement",
    "HTMLElement",
    "HTMLEmbedElement",
    "HTMLFieldSetElement",
    "HTMLFontElement", //deprecated
    "HTMLFormControlsCollection",
    "HTMLFormElement",
    "HTMLFrameElement", //deprecated
    "HTMLFrameSetElement", //deprecated
    "HTMLHRElement",
    "HTMLHeadElement",
    "HTMLHeadingElement",
    "HTMLHtmlElement",
    "HTMLIFrameElement",
    "HTMLImageElement",
    "HTMLInputElement",
    "HTMLLIElement",
    "HTMLLabelElement",
    "HTMLLegendElement",
    "HTMLLinkElement",
    "HTMLMapElement",
    "HTMLMarqueeElement", //deprecated
    "HTMLMediaElement",
    "HTMLMenuElement",
    "HTMLMetaElement",
    "HTMLMeterElement",
    "HTMLModElement",
    "HTMLOListElement",
    "HTMLObjectElement",
    "HTMLOptGroupElement",
    "HTMLOptionElement",
    "HTMLOptionsCollection",
    "HTMLOutputElement",
    "HTMLParagraphElement",
    "HTMLParamElement",
    "HTMLPictureElement",
    "HTMLPreElement",
    "HTMLProgressElement",
    "HTMLQuoteElement",
    "HTMLScriptElement",
    "HTMLSelectElement",
    "HTMLSlotElement",
    "HTMLSourceElement",
    "HTMLSpanElement",
    "HTMLStyleElement",
    "HTMLTableCaptionElement",
    "HTMLTableCellElement",
    "HTMLTableColElement",
    "HTMLTableElement",
    "HTMLTableRowElement",
    "HTMLTableSectionElement",
    "HTMLTemplateElement",
    "HTMLTextAreaElement",
    "HTMLTimeElement",
    "HTMLTitleElement",
    "HTMLTrackElement",
    "HTMLUListElement",
    "HTMLUnknownElement",
    "HTMLVideoElement",
    "HashChangeEvent",
    "History",
    "ImageBitmap",
    "ImageBitmapRenderingContext",
    "ImageData",
    "Location",
    "MediaError",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "MimeType", //deprecated
    "MimeTypeArray", //deprecated
    "Navigator",
    "OffscreenCanvas",
    "OffscreenCanvasRenderingContext2D",
    "PageTransitionEvent",
    "Path2D",
    "Plugin", //deprecated
    "PluginArray", //deprecated
    "PopStateEvent",
    "PromiseRejectionEvent",
    "RadioNodeList",
    "SharedWorker",
    "SharedWorkerGlobalScope",
    "Storage",
    "StorageEvent",
    "SubmitEvent",
    "TextMetrics",
    "TextTrack",
    "TextTrackCue",
    "TextTrackCueList",
    "TextTrackList",
    "TimeRanges",
    "TrackEvent",
    "ValidityState",
    "VideoTrack",
    "VideoTrackList",
    "WebSocket",
    "Window",
    "Worker",
    "WorkerGlobalScope",
    "WorkerLocation",
    "WorkerNavigator",
    "Worklet",
    "WorkletGlobalScope",
  ];
}
/* https://www.w3.org/TR/webaudio/#audioapi */
export function AUDIO() {
  return [
    "BaseAudioContext",
    "AudioContext",
    "OfflineAudioContext",
    "AudioBuffer",
    "AudioNode",
    "AudioParam",
    "AudioScheduledSourceNode",
    "AnalyserNode",
    "AudioBufferSourceNode",
    "AudioDestinationNode",
    "AudioListener",
    "AudioProcessingEvent",
    "BiquadFilterNode",
    "ChannelMergerNode",
    "ChannelSplitterNode",
    "ConstantSourceNode",
    "ConvolverNode",
    "DelayNode",
    "DynamicsCompressorNode",
    "GainNode",
    "IIRFilterNode",
    "MediaElementAudioSourceNode",
    "MediaStreamAudioDestinationNode",
    "MediaStreamAudioSourceNode",
    "MediaStreamTrackAudioSourceNode",
    "OscillatorNode",
    "PannerNode",
    "PeriodicWave",
    "ScriptProcessorNode", // deprecated
    "StereoPannerNode",
    "WaveShaperNode",
    "AudioWorklet",
    "AudioWorkletNode",
  ];
}
/* https://encoding.spec.whatwg.org/#api */
export function TEXTENCODER() {
  // TODO
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
