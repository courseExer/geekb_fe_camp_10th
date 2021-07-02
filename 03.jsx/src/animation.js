import timingFunction from "./timingFunction.js";
import { typeIs } from "./utils.js";

const TICK = Symbol("tick"); // fn，动画机制
const TICK_HANDLER = Symbol("tick_handler"); // number,requestAnimation的返回值
const ANIMATIONS = Symbol("animations"); // set,animation object
const ADD_ANIMATION = Symbol("add_animation"); // map,k=animation,v=timestamp
const PAUSE = Symbol("pause"); // object,动画暂停对象

// 虚拟时间线，为animation输出虚拟时间
export class Timeline {
  constructor() {
    this.state = "initialized";
    this[ANIMATIONS] = new Set();
    this[ADD_ANIMATION] = new Map();
    this[PAUSE] = {
      startTime: null,
      duration: 0,
    };
    this.element = document.createDocumentFragment();
  }
  on(type, callback) {
    const dataType = typeIs(type);
    if (!["string", "array"].includes(dataType))
      throw new Error("type类型错误");

    if (typeIs(type) === "string") type = [type];
    type.forEach((t) => {
      this.element.addEventListener(t, callback);
    });
  }
  start() {
    if (this.state !== "initialized") return;
    this.state = "started";
    let timestamp_timeline = Date.now();
    this[TICK] = () => {
      console.log("-tick-", this.state);
      let timestamp_tick = Date.now();
      for (let animation of this[ANIMATIONS]) {
        if (this.state !== "started") continue;
        const timestamp_add = this[ADD_ANIMATION].get(animation);
        const time_paused = this[PAUSE].duration;
        let time_ran = timestamp_tick - timestamp_add - time_paused;
        time_ran = time_ran < 0 ? 0 : time_ran;

        if (animation.duration < time_ran) {
          this[ANIMATIONS].delete(animation);
          time_ran = animation.duration;
        }
        if (time_ran < animation.duration) {
          const value = animation.receive(time_ran, this);
          const event = new Event("start");
          event.detail = { x: value };
          this.element.dispatchEvent(event);
        } else {
          const event = new Event("end");
          this.element.dispatchEvent(event);
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }
  // 清除时间线，当复用timeline时
  reset() {
    this.state = "initialized";
    this[ANIMATIONS].clear();
    this[ADD_ANIMATION].clear();
  }
  pause() {
    if (this.state !== "started") return;
    this.state = "paused";
    this[PAUSE].startTime = Date.now();
    this[PAUSE].duration = 0;
  }
  resume() {
    if (this.state !== "paused") return;
    this.state = "started";
    this[PAUSE].duration = Date.now() - this[PAUSE].startTime;
  }
  get rate() {}
  set rate(v) {}
  add(animationProps, timeStamp) {
    if (timeStamp === void 0) timeStamp = Date.now();
    const animation = new Animation(animationProps);
    this[ANIMATIONS].add(animation);
    this[ADD_ANIMATION].set(animation, timeStamp + animation.delay);
    console.log("任务添加完毕");
  }
}

// ？
export class Animation {
  constructor(options) {
    if (
      Object.prototype.toString
        .call(options)
        .slice(1, -1)
        .split(" ")[1]
        .toLowerCase() !== "object"
    )
      throw new Error("options必须是对象");
    this.options = {
      object: null,
      property: null,
      startValue: 0,
      endValue: 0,
      duration: 0,
      delay: 100,
      timingFunction: "linear",
    };
    Object.keys(this.options).forEach((item) => {
      this[item] = [null, void 0].includes(options[item])
        ? this.options[item]
        : options[item];
    });
  }
  receive(time, ctx) {
    let range = this.endValue - this.startValue;
    let progress = timingFunction(this.timingFunction, time / this.duration);
    const value = this.startValue + range * progress;
    return value;
  }
}
