import { Component } from "./framework.js";
import Gesture from "./gesture.js";
import Style from "./Carousel.less";

export default class Carousel extends Component {
  constructor() {
    super();
    this.option = {
      autoplay: false,
      dragDistance: "10px", // 支持小数，像素
      during: 3000,
      direction: "left", // left|right
      changeDirection: true, // 外力可以改变轮播方向
      transitionTime: 500,
    };
    // this属性需要理一理
    this.autoplay = this.option.autoplay;
    this.direction = this.option.direction;
    this.index = 0;
    this.timer = {};
    this.gesture = new Gesture(this.root);
    this.position_begin = {};
    this.offset = {};
  }
  create_ui() {
    // 前进和后退按钮
    const btn_left = document.createElement("div");
    btn_left.className = "btn btn_left";
    btn_left.dataset.id = 0;
    const btn_right = document.createElement("div");
    btn_right.className = "btn btn_right";
    btn_right.dataset.id = 1;
    // 滑块
    const slider = document.createElement("div");
    slider.id = "slider";
    slider.className = "slider";
    for (let i = 0; i < this.attributes["src"].length; i++) {
      const slide = document.createElement("div");
      slide.classList.add("slide");
      const img = document.createElement("img");
      img.src = this.attributes.src[i];
      slide.appendChild(img);
      slider.appendChild(slide);
    }
    this.slides_update(slider);
    // appendChild
    this.root.className = "carousel";
    this.root.appendChild(slider);
    this.root.appendChild(btn_left);
    this.root.appendChild(btn_right);
    // 触屏默认行为的定制，利用css的属性
    // this.root.style["touch-action"] = "none";

    return this.root;
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
        // console.log("clearTimer:", item, this.timer[item]);
        clearTimeout(this.timer[item]);
      }
    });
  }
  slides_update(sliders) {
    const slider = sliders || this.root.getElementsByClassName("slider")[0];
    for (let i = 0; i < this.attributes["src"].length; i++) {
      const slide = slider.children[i];
      slide.style["transition"] = "none";

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
      slide.style["transition"] = "";
    }
  }
  slider_animation(direction) {
    const slider = this.root.getElementsByClassName("slider")[0];
    this.slider_reset();
    slider.classList.add("move_" + direction);
  }
  slider_reset() {
    const slider = this.root.getElementsByClassName("slider")[0];
    slider.style.transition = "none";
    slider.classList.remove("move_right");
    slider.classList.remove("move_left");
    slider.style.transition = "";
  }
  moveHandler(direction, type) {
    // console.log("direction:", direction);
    if (type === "automatic") this.clearTimer("autoplay");
    this.slider_animation(direction);
    this.index = this.getIndex(direction === "right" ? -1 : 1);
    // console.log(this.index);
    this.clearTimer("transition");
    this.timer["transition"] = setTimeout(() => {
      this.slider_reset();
      this.slides_update();
      // 自动轮播
      if (this.autoplay) {
        this.timer["autoplay"] = this.automatic(this.option.during);
      }
    }, this.option.transitionTime);
  }
  automatic(ms) {
    this.clearTimer("autoplay");
    this.timer["autoplay"] = setTimeout(() => {
      if (!this.autoplay) return;
      this.moveHandler(this.direction, "automatic");
      // 自动轮播
      if (this.autoplay) {
        this.timer["autoplay"] = this.automatic(this.option.during);
      }
    }, ms);
    return this.timer["autoplay"];
  }
  render() {
    this.gesture.on("start", (e) => {
      const {} = e.detail;
      console.log(e.type);
    });
    this.gesture.on("panstart", (e) => {
      console.log(e.type);
      const { x, y } = e.detail;

      if (e.target.classList.contains("btn")) {
        e.stopPropagation();
        return false;
      }
      this.clearTimer("autoplay");
      document.body.style.cursor = "grabbing";
      this.root.style.cursor = "grabbing";
      this.position_begin.x = x;
      this.position_begin.y = y;
    });
    this.gesture.on("pan", (e) => {
      console.log(e.type);
      const { x, y } = e.detail;
      this.offset.x = x - this.position_begin.x;
      // this.offset.y = e.y - this.position_begin.y;
      slider.style.left = this.offset.x + "px";
      // console.log("x:", x);
      // console.log("this.offset:", this.offset.x);
    });
    this.gesture.on("panend", (e) => {
      console.log(e.type);
      const { x, y } = e.detail;
      document.body.style.cursor = null;
      this.root.style.cursor = "grab";
      this.autoplay = this.option.autoplay;
      const validOffset =
        typeof this.option.dragDistance === "string"
          ? this.option.dragDistance.slice(0, -2)
          : this.root.clientWidth * this.option.dragDistance;

      if (Math.abs(this.offset.x) > validOffset) {
        if (this.option.changeDirection)
          this.direction = this.offset.x > 0 ? "right" : "left";
        this.moveHandler.call(this, this.direction);
      } else {
        this.slider_reset();
      }
      slider.style.left = "";
      // 消费完毕重置
      this.offset.x = 0;
      this.offset.y = 0;

      // 自动轮播
      if (this.autoplay) {
        this.timer["autoplay"] = this.automatic(this.option.during + 500);
      }
    });
    this.gesture.on("pressstart", (e) => {
      console.log(e.type);
    });
    this.gesture.on("pressend", (e) => {
      console.log(e.type);
    });
    this.gesture.on(["tap"], (e) => {
      console.log(e.type);
      const { target } = e.detail;
      const direction = target.dataset.id == 0 ? "left" : "right";
      this.moveHandler(direction);
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
        this.timer["autoplay"] = this.automatic(this.option.during + 500);
      }
    };
  }

  mountTo(dom) {
    dom.appendChild(this.create_ui());
    this.render();
  }
}
