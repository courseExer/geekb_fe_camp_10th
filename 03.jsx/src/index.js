import "modern-normalize";
import { Component, createElement } from "./framework.js";
import Style from "./index.less";

class Carousel extends Component {
  constructor() {
    super();
    this.index = 0;
    this.timer = {};
    this.option = {
      autoplay: false,
      during: 3000,
      direction: "left", // left,right
      changeDirection: true, // 运行中外力可以改变轮播方向
      transitionTime: 500,
      dragDistance: "10px", // 支持小数，像素
    };
    this.direction = this.option.direction;
    this.autoplay = this.option.autoplay;
  }
  create_ui() {
    // 前进和后退按钮
    const btn_left = document.createElement("div");
    btn_left.className = "btn btn_left";
    const btn_right = document.createElement("div");
    btn_right.className = "btn btn_right";
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
    // ？？重新render时元素如何解绑？？
    // this.root.innerHTML = "";
    this.root.appendChild(slider);
    this.root.appendChild(btn_left);
    this.root.appendChild(btn_right);

    return this.root;
  }
  getIndex(direction) {
    if (direction === "previous") direction = -1;
    if (direction === "next") direction = 1;
    if (direction === -1) {
      return this.index === 0
        ? this.attributes["src"].length - 1
        : (this.index - 1) % this.attributes["src"].length;
    } else if (direction === 1) {
      return (this.index + 1) % this.attributes["src"].length;
    }
    return this.index;
  }
  clearTimer(name) {
    Object.keys(this.timer).forEach((item) => {
      if (name === item || !name) {
        console.log("clearTimer:", item, this.timer[item]);
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
  moveHandler(direction) {
    console.log("direction:", direction);
    this.slider_animation(direction);
    this.index = this.getIndex(direction === "right" ? -1 : 1);
    console.log(this.index);
    this.clearTimer("transition");
    this.timer["transition"] = setTimeout(() => {
      this.slider_reset();
      this.slides_update();
    }, 500);
  }
  automatic(ms) {
    this.clearTimer("autoplay");
    this.timer["autoplay"] = setTimeout(() => {
      if (!this.autoplay) return;
      this.moveHandler(this.direction);
      this.timer["autoplay"] = this.automatic(this.option.during);
    }, ms);
    return this.timer["autoplay"];
  }
  render() {
    // ===按钮===
    this.root
      .getElementsByClassName("btn_left")[0]
      .addEventListener("click", () => this.moveHandler("right"));
    this.root
      .getElementsByClassName("btn_right")[0]
      .addEventListener("click", () => this.moveHandler("left"));
    // ===鼠标拖拽===
    let pos_beg = {};
    let offset = {};
    const mousedownHandler = (e) => {
      if (e.target.classList.contains("btn")) {
        e.stopPropagation();
        return false;
      }
      console.log("mousedown");
      this.clearTimer("autoplay");
      document.addEventListener("mousemove", mousemoveHandler);
      document.addEventListener("mouseup", mouseupHandler);
      document.body.style.cursor = "grabbing";
      this.root.style.cursor = "grabbing";
      pos_beg.x = e.x;
      pos_beg.y = e.y;
    };
    const mousemoveHandler = (e) => {
      offset.x = e.x - pos_beg.x;
      offset.y = e.y - pos_beg.y;
      slider.style.left = offset.x + "px";
    };
    const mouseupHandler = (e) => {
      console.log("mouseup");
      document.removeEventListener("mousemove", mousemoveHandler);
      document.removeEventListener("mouseup", mouseupHandler);
      document.body.style.cursor = null;
      this.root.style.cursor = "grab";
      this.autoplay = this.option.autoplay;
      const validOffset =
        typeof this.option.dragDistance === "string"
          ? this.option.dragDistance.slice(0, -2)
          : this.root.clientWidth * this.option.dragDistance;

      if (Math.abs(offset.x) > validOffset) {
        if (offset.x < 0) {
          this.moveHandler.call(this, "left");
        } else if (offset.x > 0) {
          this.moveHandler.call(this, "right");
        }
      } else {
        this.slider_reset();
      }
      slider.style.left = "";
      // 消费完毕重置
      offset.x = 0;
      offset.y = 0;
      if (this.option.autoplay) {
        this.timer["autoplay"] = this.automatic();
      }
    };

    this.root.addEventListener("mousedown", mousedownHandler);

    // ===自动轮播功能===
    window.onload = () => {
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

const images = [
  "./asset/resource/horizon.jpg",
  "./asset/resource/vertical.jpg",
  "./asset/resource/square-small.jpg",
  "./asset/resource/square-big.jpg",
];
let a = <Carousel id="carousel" src={images} />;
a.mountTo(document.getElementById("app"));
