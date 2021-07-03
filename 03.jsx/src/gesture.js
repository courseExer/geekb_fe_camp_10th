import { defaultOptions } from "./gestureDefaultConfig.js";
import { typeIs } from "./utils.js";

// Todo：
// - 支持多触点
export class Gesture {
  constructor(elm, config) {
    if (elm && !(elm instanceof EventTarget)) throw new Error("elm参数错误");
    if (config && typeIs(config) !== "object")
      throw new Error("config参数错误");
    this.element = elm || document;
    this.options = Object.assign({}, config, defaultOptions);
    this.state = "init";
    this.hasTouchApis = false;
    // 实例
    this.listener = new Listener(this.element, this);
    this.recognize = new Recognize(this.element, this);
    this.dispatcher = new Dispatcher(this.element, this);
  }
  // type支持数组或字符串
  on(type, callback) {
    const dataType = typeIs(type);
    if (!["string", "array"].includes(dataType))
      throw new Error("type类型错误");

    if (typeIs(type) === "string") type = [type];
    type.forEach((t) => {
      this.element.addEventListener(t, callback);
    });
  }
  getState() {
    return this.state;
  }
  setState(eventName) {
    if (!this.options.supportEvents.concat("init").includes(eventName))
      throw new Error("参数非法");
    this.state = eventName;
  }
}
export class Listener {
  constructor(elm, ctx) {
    if (elm && !(elm instanceof EventTarget)) throw new Error("elm参数错误");
    this.element = elm || document;
    this.ctx = ctx;
    this.init();
  }
  init() {
    const { requireEvents, preventEvents } = this.ctx.options;
    requireEvents &&
      requireEvents.forEach((eventName) => {
        if (["mousemove", "mouseup"].includes(eventName)) return;
        const bindingObject = ["mousedown", "touchstart"].includes(eventName)
          ? this.element
          : document;
        bindingObject.addEventListener(eventName, (e) => {
          this["handle_" + eventName](e);
          console.log("mouse系列绑定");
        });
      });
    preventEvents &&
      preventEvents.forEach((eventName) => {
        this.element.addEventListener(eventName, (e) => e.preventDefault());
      });
  }
  normalize_event(e) {
    let eventData = new Event(e.type);
    eventData["_event"] = e;
    eventData["touches"] = e.touches || [];
    eventData["detail"] = {};
    eventData["detail"]["target"] = e.target;
    let buttonData = getMouseButton(e);
    if (e.type.indexOf("mouse") === 0) {
      for (let index = 0; index < buttonData.length; index++) {
        if (buttonData[index] !== "1") continue;
        eventData["touches"].push({
          identifier: index,
          clientX: e.clientX,
          clientY: e.clientY,
          offsetX: 0,
          offsetY: 0,
          target: e.target,
        });
      }
    } else if (e.type.indexOf("touch") === 0) {
      eventData["touches"] = Array.prototype.map.call(
        e.touches,
        (item) => item
      );
    }

    return eventData;
  }
  handle_mousedown(e) {
    console.log("mousedown！");
    // e.preventDefault();
    if (this.ctx.hasTouchApis) {
      this.element.removeEventListener(
        "mousedown",
        this.handle_mousedown.bind(this)
      );
      return;
    }
    this.ctx.recognize.handle_start(this.normalize_event(e));
    document.addEventListener("mousemove", (e) => this.handle_mousemove(e));
    document.addEventListener("mouseup", (e) => this.handle_mouseup(e));
  }
  handle_mousemove(e) {
    this.ctx.recognize.handle_move(this.normalize_event(e));
  }
  handle_mouseup(e) {
    this.element.removeEventListener(
      "mousemove",
      this.handle_mousemove.bind(this)
    );
    this.element.removeEventListener("mouseup", this.handle_mouseup.bind(this));
    this.ctx.recognize.handle_end(this.normalize_event(e));
  }
  handle_touchstart(e) {
    this.ctx.hasTouchApis = true;
    this.ctx.recognize.handle_start(this.normalize_event(e));
  }
  handle_touchmove(e) {
    this.ctx.recognize.handle_move(this.normalize_event(e));
  }
  handle_touchend(e) {
    this.ctx.recognize.handle_end(this.normalize_event(e));
  }
}
export class Recognize {
  constructor(elm, ctx) {
    if (elm && !(elm instanceof EventTarget)) throw new Error("elm参数错误");
    this.element = elm || document;
    this.ctx = ctx;
    this.points = [];
    this.timer = {};
    this.timeStamp = null;
  }
  handle_start(event) {
    const { type, touches, target } = event;
    const { getState, setState, dispatcher } = this.ctx;

    if (this.ctx.state !== "init") return;
    setState.call(this.ctx, "start");
    this.points = touches; // !!mutable
    this.timestamp = Date.now();
    this.timer["pressstart"] = setTimeout(() => {
      setState.call(this.ctx, "pressstart");
      dispatcher.dispatch.call(this.ctx, this.ctx.state);
    }, 500);
    dispatcher.dispatch.call(this.ctx, this.ctx.state, {
      x: this.points[0].offsetX,
      y: this.points[0].offsetY,
      target: event.touches[0].target,
    });
  }
  handle_move(event) {
    const { type, touches } = event;
    const { getState, setState, dispatcher } = this.ctx;
    const leafStates = ["init", "tap", "panend", "pressend", "flick", "swipe"];

    if (leafStates.includes(this.ctx.state)) return;
    if (this.timer["pressstart"]) {
      clearTimeout(this.timer["pressstart"]);
      this.timer["pressstart"] = null;
    }
    touches.forEach((item, index) => {
      this.points[index].offsetX = item["clientX"] - this.points[index].clientX;
      this.points[index].offsetY = item["clientY"] - this.points[index].clientY;
      const dist =
        this.points[index].offsetX ** 2 + this.points[index].offsetY ** 2;
      if (this.ctx.state === "start" || this.ctx.state === "pressstart") {
        if (Math.abs(dist) >= 10) setState.call(this.ctx, "panstart");
      } else if (this.ctx.state === "pressstart" && Math.abs(dist) >= 100) {
        setState.call(this.ctx, "panstart");
      } else if (this.ctx.state === "panstart") {
        setState.call(this.ctx, "pan");
      } else if (this.ctx.state === "pan") {
        // todo
      } else {
        debugger;
      }
    });
    dispatcher.dispatch.call(this.ctx, this.ctx.state, {
      x: this.points[0].offsetX,
      y: this.points[0].offsetY,
    });
    console.log(this.points[0].offsetX, this.points[0].offsetY);
  }
  handle_end(event) {
    const { type } = event;
    const { getState, setState, dispatcher } = this.ctx;
    let props = {};

    if (this.timer["pressstart"]) {
      clearTimeout(this.timer["pressstart"]);
      this.timer["pressstart"] = null;
    }
    if (this.ctx.state === "start") {
      setState.call(this.ctx, "tap");
      props.target = event.detail.target;
    } else if (this.ctx.state === "panstart") {
      setState.call(this.ctx, "panend");
    } else if (this.ctx.state === "pan") {
      const dist =
        Math.abs(this.points[0].offsetX) ** 2 +
        Math.abs(this.points[0].offsetY) ** 2;
      const duration = Date.now() - this.timestamp;
      if (dist / duration >= 600) {
        setState.call(this.ctx, "flick");
        props["direction"] =
          Math.abs(this.points[0].offsetX) ** 2 <
          Math.abs(this.points[0].offsetY) ** 2
            ? "vertical"
            : "horizontal";
        if (props["direction"] === "vertical") {
          props["direction"] = this.points[0].offsetY < 0 ? "up" : "down";
        } else if (props["direction"] === "horizontal") {
          props["direction"] = this.points[0].offsetX < 0 ? "left" : "right";
        }
      } else {
        setState.call(this.ctx, "panend");
      }
    } else if (this.ctx.state === "pressstart") {
      setState.call(this.ctx, "pressend");
    }
    dispatcher.dispatch.call(this.ctx, this.ctx.state, props);
    setState.call(this.ctx, "init");
  }
  handle_cancel(event) {
    setState.call(this.ctx, "init");
    dispatcher.dispatch(this.ctx, this.ctx.state);
  }
}
export class Dispatcher {
  constructor(elm, ctx) {
    if (elm && !(elm instanceof EventTarget)) throw new Error("elm参数错误");
    this.element = elm || document;
    this.ctx = ctx;
    this.lastState = this.ctx.state;
  }
  dispatch(eventName, props) {
    let event = new Event(eventName);
    event.detail = {};
    for (let propName in props) {
      if (props.hasOwnProperty(propName)) {
        event["detail"][propName] = props[propName];
      }
    }
    // allowOnlyOnce
    if (["start"].includes(eventName) && this.lastState === eventName) {
      return;
    }
    // elm.dispatchEvent(event)之后，event.target就是elm
    // 所以，我们现在有2个方式来传递target：
    // - targetElm.dispatchEvent(event); // 方案1
    // - event.detail = {target:targetElm}; otherElm.dispatchEvent(event);// 方案2
    // 方案1和2的核心区别在于到底由谁来触发自定义事件，这也决定了外层如何监听事件。
    // 如果采用方案1，理解成本很低。
    // - 里层来看，用户触发了哪个UI元素就由谁来派发事件
    // - 外层来看，还是能监听根元素的，因为事件可以冒泡
    // - 担忧：那如果哪一层阻止来冒泡呢？是否需要自己来建立一套事件体系更安全呢？
    // 如果采用方案2，理解成本也不高。
    // - 里层来看，全权由根元素代理派发事件。detail是唯一开放的属性（当然你可以添加event上的属性）
    // - 外层来看，监听这个代理元素，无需冒泡。
    this.element.dispatchEvent(event);
    this.lastState = eventName;
  }
}

export default function factory(elm, config) {
  return new Gesture(elm, config);
}

function getMouseButton(event) {
  if (!(event instanceof MouseEvent)) {
    return false;
  }
  return event.buttons.toString().padStart(5, 0).split("").reverse();
}
