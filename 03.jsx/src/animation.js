const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick_handler");
const ANIMATIONS = Symbol("animations");

// 虚拟时间线，为animation输出虚拟时间
export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set();
  }
  start() {
    let startTime = Date.now();
    this[TICK] = (timestamp) => {
      // console.log("timestamp:", timestamp);
      let t = Date.now() - startTime;
      for (let animation of this[ANIMATIONS]) {
        let t0 = t;
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t0 = animation.duration;
        }
        animation.receive(t0);
      }
      requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }
  // 清除时间线，当复用timeline时
  reset() {}
  pause() {}
  resume() {}
  get rate(){}
  set rate(v){}
  add(animation) {
    this[ANIMATIONS].add(animation);
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
      timingFunction: ["linear", "ease"][0],
    };
    Object.keys(this.options).forEach((item) => {
      this.options[item] = "";
      this[item] = [null, void 0].includes(options[item])
        ? this.options[item]
        : options[item];
    });
  }
  receive(time) {
    let range = this.endValue - this.startValue;
    this.object[this.property] =
      this.startValue + range * (time / this.duration);
    console.log(this.object[this.property]);
  }
}
