import Style from "./Carousel.less";
import { createElement, Component } from "./framework.js";
import Gesture from "./gesture.js";
import { Timeline } from "./animation.js";

// Todo:
// - timeline动画过程中，轮播暂停的情况
// - 其他事件的处理
// - Fragment元素
export default class Carousel extends Component {
  constructor() {
    super();
    this.root = document.createElement("div");
    this.option = {
      autoplay: false,
      dragDistance: "30px", // 支持小数，像素
      duration: 3000,
      direction: "left", // left|right
      changeDirection: true, // 外力可以改变轮播方向
      transitionTime: 500,
    };
    // ！this属性有点多，需要理一理
    this.autoplay = this.option.autoplay;
    this.direction = this.option.direction;
    this.index = 0;
    this.timer = {};
    this.position_begin = {};
    this.offset = {};
  }
  componentDidMount() {
    this.gesture = new Gesture(this.root);
    this.timeline = new Timeline();
    this.timeline.start();
    this.slider = this.root.getElementsByClassName("slider")[0];
    this.timeline.on("start", (e) => {
      const { x } = e.detail;
      this.slider.style.transform = `translate3d(${x}px,0,0)`;
    });
    this.timeline.on("end", (e) => {
      this.slides_update();
      this.slider.style.transform = `translate3d(0,0,0)`;
    });
    this.gesture.on("start", (e) => {
      console.log(e.type);
      const {} = e.detail;
    });
    this.gesture.on("panstart", (e) => {
      const { x, y } = e.detail;
      if (e.target.classList.contains("btn")) {
        e.stopPropagation();
        return false;
      }
      this.clearTimer("autoplay");
      document.documentElement.style.cursor = "grabbing";
      this.root.style.cursor = "grabbing";
      this.position_begin.x = x;
      this.position_begin.y = y;
    });
    this.gesture.on("pan", (e) => {
      console.log(e.type);
      const { x, y } = e.detail;
      this.offset.x = x - this.position_begin.x;
      // this.offset.y = e.y - this.position_begin.y;
      this.slider.style.transform = `translate3d(${this.offset.x}px, 0, 0)`;
      // this.slider.style.left = this.offset.x + "px";
    });
    this.gesture.on("panend", (e) => {
      console.log(e.type);
      const { x, y } = e.detail;
      document.documentElement.style.cursor = null;
      this.root.style.cursor = null;
      // this.autoplay = this.option.autoplay;
      const validOffset =
        typeof this.option.dragDistance === "string"
          ? this.option.dragDistance.slice(0, -2)
          : this.root.clientWidth * this.option.dragDistance;

      if (Math.abs(this.offset.x) > validOffset) {
        if (this.option.changeDirection)
          this.direction = this.offset.x > 0 ? "right" : "left";
        const sign = this.direction === "left" ? 1 : -1;
        this.index = this.getIndex(sign);

        this.moveHandler.call(this, {
          startValue: this.offset.x,
          endValue: this.root.clientWidth,
        });
      } else {
        this.moveHandler.call(this, {
          direction: this.offset.x > 0 ? "left" : "right",
          startValue: this.offset.x,
          endValue: 0,
          duration:
            this.option.duration * (this.offset.x / this.root.clientWidth),
        });
      }

      // 消费完毕重置
      this.offset.x = 0;
      this.offset.y = 0;

      // 自动轮播
      if (this.autoplay) {
        this.timer["autoplay"] = this.automatic(this.option.duration + 500);
      }
    });
    this.gesture.on("pressstart", (e) => {
      console.log(e.type);
      document.documentElement.style.cursor = "grabbing";
      this.root.style.cursor = "grabbing";
    });
    this.gesture.on("pressend", (e) => {
      console.log(e.type);
      document.documentElement.style.cursor = null;
      this.root.style.cursor = null;
    });
    this.gesture.on(["tap"], (e) => {
      console.log(e.type);
      const { target } = e.detail;
      const direction = target.dataset.id == 0 ? "right" : "left";
      const sign = direction === "left" ? 1 : -1;
      this.index = this.getIndex(sign);

      this.moveHandler.call(this, {
        startValue: 0,
        endValue: this.root.clientWidth * sign,
      });
    });
    this.gesture.on("flick", (e) => {
      const { direction } = e.detail;
      console.log(e.type);
      this.moveHandler(direction);
    });
    this.gesture.on("cancel", (e) => {
      console.log(e.type);
    });
    window.onload = () => {
      // 自动轮播
      if (this.autoplay) {
        this.timer["autoplay"] = this.automatic(this.option.duration + 500);
      }
    };
  }
  render() {
    const slides = () => {
      return this.attributes["src"].map((item, index) => {
        let clazz = "";
        if (index === this.index) {
          clazz = " current";
        } else if (index === this.getIndex(-1)) {
          clazz = " previous";
        } else if (index === this.getIndex(1)) {
          clazz = " next";
        }
        return (
          <div className={"slide" + clazz}>
            <img src={item} />
          </div>
        );
      });
    };
    console.log("this.children:", this.children);
    return (
      <div className="carousel">
        <div className="slider" id="slider">
          {slides()}
          {this.children}
        </div>
        <div className="btn btn_left" data-id="0"></div>
        <div className="btn btn_right" data-id="1"></div>
      </div>
    );
  }
  // 根据当前序号取序号
  // previous/-1, 向前取
  // next/1,向后取
  getIndex(amount) {
    amount = amount || 0;
    if (amount === "previous") {
      amount = -1;
    } else if (amount === "next") {
      amount = 1;
    }
    if (amount >= 0) {
      return (this.index + amount) % this.attributes["src"].length;
    } else if (amount < 0) {
      return (
        (this.index + amount + this.attributes["src"].length) %
        this.attributes["src"].length
      );
    }
  }
  clearTimer(name) {
    Object.keys(this.timer).forEach((item) => {
      if (name === item || !name) {
        clearTimeout(this.timer[item]);
      }
    });
  }
  slides_update(sliders) {
    for (let i = 0; i < this.attributes["src"].length; i++) {
      const slide = this.slider.children[i];

      if (i === this.index) {
        slide.classList.add("current");
        slide.classList.remove("previous");
        slide.classList.remove("next");
      } else if (i === this.getIndex(-1)) {
        slide.classList.add("previous");
        slide.classList.remove("current");
        slide.classList.remove("next");
      } else if (i === this.getIndex(1)) {
        slide.classList.add("next");
        slide.classList.remove("current");
        slide.classList.remove("previous");
      } else {
        slide.classList.remove("current");
        slide.classList.remove("previous");
        slide.classList.remove("next");
      }
    }
  }
  moveHandler(options = {}) {
    options = {
      direction: options.direction || this.direction,
      startValue: options.startValue >= 0 ? options.startValue : this.offset.x,
      endValue: Number.isSafeInteger(options.endValue)
        ? options.endValue
        : this.root.clientWidth,
      delay: options.delay || 0,
      duration:
        options.duration >= 0 ? options.duration : this.option.transitionTime,
    };
    const sign = options.direction === "right" ? 1 : -1;
    const animationProps = {
      object: this.slider,
      property: "transform",
      startValue: options.startValue,
      endValue: options.endValue * sign,
      delay: options.delay,
      duration: options.duration,
    };
    this.timeline.add(animationProps);
  }
  automatic(ms) {
    this.clearTimer("autoplay");
    this.timer["autoplay"] = setTimeout(() => {
      if (!this.autoplay) return;
      this.moveHandler(this.direction);
      // 自动轮播
      if (this.autoplay) {
        this.timer["autoplay"] = this.automatic(this.option.duration);
      }
    }, ms);
    return this.timer["autoplay"];
  }
}
