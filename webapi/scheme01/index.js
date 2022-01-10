import { ECMA, WINDOW, INTERFACE, STREAMS, AUDIO } from "./CONST.js";

let collection = {}; // 归类整理

void (function main() {
  let globalNames = Object.getOwnPropertyNames(window);
  console.log("window的自身属性数量:", globalNames.length);

  // webkit prefix
  {
    console.log("\n---webkit---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/^webkit/i)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["webkitPrefix"] = matchedProperties;
    console.log("匹配的属性：", matchedProperties);
  }

  // ECMA 262
  {
    console.log("\n---ECMA262---");
    const properties = ECMA();
    let matchedProperties = []; // properties与name的交集
    collection["ECMA-262"] = properties;
    globalNames = globalNames.filter((name) => {
      if (properties.includes(name)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    console.log("定义的属性个数：", properties.length);
    console.log("与window对象属性的交集：", matchedProperties.length);
    console.log(
      "不在于window对象上的属性:",
      getComplement(properties, matchedProperties)
    );
  }

  // DOM - Node Class
  {
    console.log("\n---Node类---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      try {
        if (window[name].prototype instanceof Node) {
          matchedProperties.push(name);
          return false;
        }
        return true;
      } catch (e) {
        return true;
      }
    });
    globalNames = globalNames.filter((name) => {
      if (name === "Node") return false;
      return true;
    });

    collection["node"] = matchedProperties;
    console.log("匹配的属性个数:", matchedProperties.length);
  }

  // DOM - event - on
  {
    console.log("\n---onEvent---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/^on/)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["onEventName"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }
  {
    console.log("\n---CSS-object---");
    let names = [
      "AnimationEvent",
      "CaretPosition",
      "FontFace",
      "FontFaceSet",
      "FontFaceSetLoadEvent",
      "GetStyleUtils",
      "MediaList",
      "MediaQueryList",
      "MediaQueryListEvent",
      "Screen",
      "StyleSheet",
      "StyleSheetList",
      "TransitionEvent",
    ];
    globalNames = globalNames.filter((name) => {
      if (names.includes(name)) {
        return false;
      }
      if (/^CSS/.test(name)) {
        names.push(name);
        return false;
      }
      return true;
    });
    collection["CSSOM"] = names;
  }

  // whatwg - window
  {
    console.log("\n---window-object---");
    const properties = WINDOW();
    let matchedProperties = [];
    collection["window-object"] = properties;
    globalNames = globalNames.filter((name) => {
      if (properties.includes(name)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    console.log("定义的属性个数：", properties.length);
    console.log("属性与window对象属性的交集：", matchedProperties.length);
    console.log(
      "不在window对象上的属性:",
      getComplement(properties, matchedProperties)
    );
  }

  // whatwg - interfaces
  {
    console.log("\n---html-interfaces---");
    const properties = INTERFACE();
    let matchedProperties = [];
    collection["html-interfaces"] = properties;
    globalNames = globalNames.filter((name) => {
      if (properties.includes(name)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    console.log("定义的属性个数：", properties.length);
    console.log("与window对象属性的交集：", matchedProperties.length);
    console.log(
      "不在window对象上的属性:",
      getComplement(properties, matchedProperties)
    );
  }

  // Intl
  // https://402.ecma-international.org/5.0/#intl-object
  {
    console.log("\n---Intl---");
    globalNames = globalNames.filter((item) => item !== "Intl");
    collection["Intl"] = "Intl";
    console.log("匹配的属性个数：", 1);
  }

  // webgl
  // https://www.khronos.org/registry/webgl/specs/latest/
  // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API
  {
    console.log("\n---webgl---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/^webgl/i)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["Webgl"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // dom-textencoder
  // https://encoding.spec.whatwg.org/#api
  {
    console.log("\n---textencoder?---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/Text/)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["textEncoding"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // SVG
  {
    console.log("\n---svg---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/^svg/i)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["SVG"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // audio
  // https://www.w3.org/TR/webaudio/#audioapi
  {
    console.log("\n---audio---");
    const properties = AUDIO();
    let matchedProperties = []; // properties与name的交集
    collection["audio"] = properties;
    globalNames = globalNames.filter((name) => {
      if (properties.includes(name)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    console.log("定义的属性个数：", properties.length);
    console.log("属性与window对象属性的交集：", matchedProperties.length);
    console.log(
      "属性不在于window对象上的如下:",
      getComplement(properties, matchedProperties)
    );
  }

  // video
  {
    console.log("\n---video---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/video/i)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["video"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // streams
  {
    console.log("\n---streams---");
    const properties = STREAMS();
    let matchedProperties = [];
    collection["streams"] = properties;
    globalNames = globalNames.filter((name) => {
      if (properties.includes(name)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    console.log("定义的属性个数：", properties.length);
    console.log("属性与window对象属性的交集：", matchedProperties.length);
    console.log(
      "属性不在于window对象上的如下:",
      getComplement(properties, matchedProperties)
    );
  }

  // background-sync-manager
  // https://wicg.github.io/background-sync/spec/

  {
    console.log("\n---background-sync-manager---");
    const properties = ["SyncManager"];
    let matchedProperties = [];
    collection["background-sync-manager"] = properties;
    globalNames = globalNames.filter((name) => {
      if (properties.includes(name)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    console.log("定义的属性个数：", properties.length);
    console.log("属性与window对象属性的交集：", matchedProperties.length);
    console.log(
      "属性不在于window对象上的如下:",
      getComplement(properties, matchedProperties)
    );
  }

  // ------------------待继续整理-----------------

  // events
  {
    console.log("\n---events---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/Event/)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["includeEvent"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // errors
  {
    console.log("\n---includeErrors---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/error/i)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["includeError"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // client request
  {
    console.log("\n---client request---");
    const names = [
      "FormData",
      "XMLHttpRequest",
      "XMLHttpRequestEventTarget",
      "XMLHttpRequestUpload",
    ];
    collection["client-request"] = names;
    globalNames = globalNames.filter((name) => {
      if (names.includes(name)) {
        return false;
      }
      return true;
    });
  }
  {
    console.log("\n---WebXR---");
    let names = [];
    globalNames = globalNames.filter((name) => {
      if (/^XR/.test(name)) {
        names.push(name);
        return false;
      }
      return true;
    });
    collection["WebXR"] = names;
  }
  {
    console.log("\n---WebRTC---");
    let names = [
      "MediaDevices",
      "MediaStream",
      "MediaStreamEvent",
      "MediaStreamTrack",
      "MessageEvent",
    ];
    globalNames = globalNames.filter((name) => {
      if (names.includes(name)) {
        return false;
      }
      if (/^RTC/.test(name)) {
        names.push(name);
        return false;
      }
      return true;
    });
    collection["WebRTC"] = names;
  }
  {
    console.log("\n---GamePad---");
    let names = [];
    globalNames = globalNames.filter((name) => {
      if (/^Gamepad/.test(name)) {
        names.push(name);
        return false;
      }
      return true;
    });
    collection["Gamepad"] = names;
  }
  {
    console.log("---IndexedDB---");
    let names = [
      "IDBCursor",
      "IDBCursorSync",
      "IDBCursorWithValue",
      "IDBDatabase",
      "IDBDatabaseException",
      "IDBDatabaseSync",
      "IDBEnvironment",
      "IDBEnvironmentSync",
      "IDBFactory",
      "IDBFactorySync",
      "IDBIndex",
      "IDBIndexSync",
      "IDBKeyRange",
      "IDBObjectStore",
      "IDBObjectStoreSync",
      "IDBOpenDBRequest",
      "IDBRequest",
      "IDBTransaction",
      "IDBTransactionSync",
      "IDBVersionChangeEvent",
      "IDBVersionChangeRequest",
    ];
    globalNames = globalNames.filter((name) => {
      if (names.includes(name)) {
        names.push(name);
        return false;
      }
      return true;
    });
    collection["IndexedDB"] = names;
  }
  {
    console.log("---Web MIDI---");
    let names = [];
    globalNames = globalNames.filter((name) => {
      if (/^MIDI/.test(name)) {
        names.push(name);
        return false;
      }
      return true;
    });
    collection["MIDI"] = names;
  }
  {
    console.log("---The Encrypted Media Extensions---");
    let names = [
      "MediaKeySessionEvent",
      "MediaKeys",
      "MediaKeySession",
      "MediaKeyStatusMap",
      "MediaKeySystemAccess",
    ];
    globalNames = globalNames.filter((name) => {
      if (names.includes(name)) {
        return false;
      }
      return true;
    });
    collection["Encrypted-media"] = names;
  }
  {
    console.log("---WebTransport---");
    let names = [];
    globalNames = globalNames.filter((name) => {
      if (/^WebTransport/.test(name)) {
        names.push(name);
        return false;
      }
      return true;
    });
    collection["WebTransport"] = names;
  }
  {
    console.log("---BlueTooth---");
    let names = [];
    globalNames = globalNames.filter((name) => {
      if (/^bluetooth/i.test(name)) {
        names.push(name);
        return false;
      }
      return true;
    });
    collection["bluetooth"] = names;
  }
  {
    console.log("---File System Access API---");
    let names = [
      "FileSystemHandle",
      "FileSystemFileHandle",
      "FileSystemDirectoryHandle",
      "FileSystemWritableFileStream",
    ];
    globalNames = globalNames.filter((name) => {
      if (names.includes(name)) {
        return false;
      }
      return true;
    });
    collection["File-System-Access"] = names;
  }
  {
    console.log("---File and Directory Entries API---");
    let names = [
      "FileSystemDirectoryEntry",
      "FileSystemDirectoryReader",
      "FileSystemEntry",
      "FileSystemFileEntry",
      "FileSystemFlags",
      "FileSystem",
    ];
    globalNames = globalNames.filter((name) => {
      if (names.includes(name)) {
        return false;
      }
      return true;
    });
    collection["File-and-Directory-Entries"] = names;
  }
  {
    console.log("---USB---");
    let names = [];
    globalNames = globalNames.filter((name) => {
      if (/^USB/.test(name)) {
        return false;
      }
      return true;
    });
    collection["Web-USB"] = names;
  }
  {
    console.log("---canvas---");
    let names = [
      "HTMLCanvasElement",
      "CanvasRenderingContext2D",
      "CanvasGradient",
      "CanvasPattern",
      "ImageBitmap",
      "ImageData",
      "TextMetrics",
      "Path2D",
    ];
    globalNames = globalNames.filter((name) => {
      if (names.includes(name)) {
        return false;
      }
      return true;
    });
    collection["canvas"] = names;
  }
  {
    console.log("---Web HID---");
    let names = [
      "HID",
      "HIDDevice",
      "HIDInputReportEvent",
      "HIDConnectionEvent",
    ];
    globalNames = globalNames.filter((name) => {
      if (names.includes(name)) {
        return false;
      }
      return true;
    });
    collection["WebHID"] = names;
  }
  /* =================剩余的属性======================= */
  console.log("\n\nmatchedCollection:", collection);
  console.log("\n\n剩余的globalNames:", globalNames);
  // console.table(globalNames);
})();

/**
 * 求差集
 * @param {Array} arr 匹配的集合
 * @param {Array} arr2 被匹配的集合
 * @returns {Array} 差集
 */
function getComplement(arr1, arr2) {
  return arr1.filter((item) => !arr2.includes(item));
}
