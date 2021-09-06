import { ECMA, WINDOW, INTERFACE, STREAMS, AUDIO } from "./CONST.js";

/**
 * 求差集
 * @param {Array} arr 集合
 * @param {Array} subArr 子集合
 * @returns {Array} 差集
 */
function getComplement(arr, subArr) {
  return arr.filter((item) => !subArr.includes(item));
}

let collection = {}; // 归类整理

void (function main() {
  let globalNames = Object.getOwnPropertyNames(window);
  console.log("window的自身属性数量:", globalNames.length); // 983

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
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // ECMA 262
  {
    console.log("\n---ECMA262---");
    const properties = ECMA();
    let matchedProperties = []; // properties与name的交集
    collection["ecmascript"] = properties;
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
    globalNames = globalNames.filter((e) => {
      if (e === "Node") return false;
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
    collection["onEvent"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // whatwg - window
  {
    console.log("\n---window---");
    const properties = WINDOW();
    let matchedProperties = [];
    collection["window"] = properties;
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

  // whatwg - interfaces
  {
    console.log("\n---interfaces---");
    const properties = INTERFACE();
    let matchedProperties = [];
    collection["interfaces"] = properties;
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
    collection["webgl"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  
  // dom-textencoder
  // https://encoding.spec.whatwg.org/#api
  {
    console.log("\n---textencoder---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/text/i)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["textEncoder"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // SVG
  {
    console.log("\n---(待整理)svg---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/svg/i)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["svg"] = matchedProperties;
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
  console.log("----------以下待整理---------")
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
    collection["events"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  // errors
  {
    console.log("\n---errors---");
    let matchedProperties = [];
    globalNames = globalNames.filter((name) => {
      if (name.match(/error/i)) {
        matchedProperties.push(name);
        return false;
      }
      return true;
    });
    collection["errors"] = matchedProperties;
    console.log("匹配的属性个数：", matchedProperties.length);
  }

  /* 剩余的属性 */
  console.log("\n\nmatchedCollection:", collection);
  console.log("\n\n剩余的globalNames:", globalNames);
  // console.table(globalNames);
})();
