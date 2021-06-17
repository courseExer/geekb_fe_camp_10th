import "modern-normalize";
import { Component, createElement } from "./framework.js";
import Style from "./index.less";

class Carousel extends Component {
  constructor() {
    super();
    this.root.className = "carousel";
  }
  render() {
    const fragment = document.createDocumentFragment();
    const slider = document.createElement("div");
    slider.className = "slider";
    slider.dataset.index = 0;
    for (let i = 0; i < this.attributes.src.length; i++) {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.dataset.number = i;
      const img = document.createElement("img");
      img.src = this.attributes.src[i];
      slide.appendChild(img);
      slider.appendChild(slide);
    }
    fragment.appendChild(slider);
    this.root.appendChild(fragment);
    return this.root;
  }
  mountTo(dom) {
    dom.appendChild(this.render());
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
