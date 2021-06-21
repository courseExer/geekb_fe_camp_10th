import "modern-normalize";
import { Component, createElement } from "./framework.js";
import Style from "./index.less";

class Carousel extends Component {
  constructor() {
    super();
    this.root.className = "carousel";
    this.index = 0;
    this.parentDom = null;
    this.time_mount = null;
    this.time_move = null;
    // this.once();
  }
  once() {
    this.time_mount = setInterval(() => {
      this.mountTo(this.parentDom);
    }, 3000);
  }
  // 自动轮播功能
  render() {
    const slider = document.createElement("div");
    slider.className = "slider";

    for (let i = 0; i < this.attributes.src.length; i++) {
      const img = document.createElement("img");
      img.src = this.attributes.src[i];

      const slide = document.createElement("div");
      slide.classList.add("slide");
      if (i === this.index) {
        slide.classList.add("current");
      } else if (
        i === this.index - 1 ||
        (this.index === 0 && i === this.attributes["src"].length - 1)
      ) {
        slide.classList.add("backward");
      } else if (
        i === this.index + 1 ||
        (this.index === this.attributes["src"].length - 1 && i === 0)
      ) {
        slide.classList.add("forward");
      }
      slide.appendChild(img);
      slider.appendChild(slide);
    }

    this.root.innerHTML = "";
    this.root.appendChild(slider);

    // move
    this.time_move = setTimeout(() => {
      slider.classList.add("move");
      this.index = ++this.index % this.attributes["src"].length;
    }, 2500);

    return this.root;
  }
  // 拖拽轮播
  render2() {
    const slider = document.createElement("div");
    slider.className = "slider";

    for (let i = 0; i < this.attributes.src.length; i++) {
      const img = document.createElement("img");
      img.src = this.attributes.src[i];

      const slide = document.createElement("div");
      slide.classList.add("slide");
      if (i === this.index) {
        slide.classList.add("current");
      } else if (
        i === this.index - 1 ||
        (this.index === 0 && i === this.attributes["src"].length - 1)
      ) {
        slide.classList.add("backward");
      } else if (
        i === this.index + 1 ||
        (this.index === this.attributes["src"].length - 1 && i === 0)
      ) {
        slide.classList.add("forward");
      }
      slide.appendChild(img);
      slider.appendChild(slide);
    }
    this.root.innerHTML = "";
    this.root.appendChild(slider);

    const mousedownHandler = (event) => {
      console.log("mousedown");
      this.root.addEventListener("mousemove", mousemoveHandler);
      this.root.addEventListener("mouseup", mouseupHandler);
    };
    const mousemoveHandler = (event) => {
      console.log("mousemove");
    };
    const mouseupHandler = (event) => {
      console.log("mouseup");
      this.root.removeEventListener("mouseup", mousemoveHandler);
      this.root.removeEventListener("mousemove", mousedownHandler);
      // 为啥消不掉自己？？
      this.root.removeEventListener("mousedown", mouseupHandler);
    };

    this.root.addEventListener("mousedown", mousedownHandler);

    return this.root;
  }
  mountTo(dom) {
    this.parentDom = dom;
    // dom.appendChild(this.render());
    dom.appendChild(this.render2());
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
