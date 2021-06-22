import "modern-normalize";
import { Component, createElement } from "./framework.js";
import Style from "./index.less";
import Carousel from "./Carousel.js";
import { Timeline, Animation } from "./animation.js";

const images = [
  "./asset/resource/horizon.jpg",
  "./asset/resource/vertical.jpg",
  "./asset/resource/square-small.jpg",
  "./asset/resource/square-big.jpg",
];
// let a = <Carousel id="carousel" src={images} />;
// a.mountTo(document.getElementById("app"));

let timeline = new Timeline();

timeline.add(
  new Animation({
    object: {},
    property: "test",
    startValue: 0,
    endValue: 100,
    duration: 1000,
  })
);
// timeline.start();
