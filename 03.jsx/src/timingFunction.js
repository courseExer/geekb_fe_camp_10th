import BezierEasing from "bezier-easing";

export function linear(v) {
  return v;
}

// export const linear = BezierEasing(0, 0, 1, 1);
export const ease = BezierEasing(0.5, 0, 0.5, 1);
export const easeIn = BezierEasing(0.5, 0, 1, 1);
export const easeOut = BezierEasing(0, 0, 0.5, 1);
export const easeInOut = BezierEasing(0.5, 0, 0.5, 1);

export default function timingFunction(name, value) {
  if (name === "ease") {
    return ease(value);
  } else if (name === "easeIn") {
    return easeIn(value);
  } else if (name === "easeOut") {
    return easeOut(value);
  } else if (name === "easeInOut") {
    return easeInOut(value);
  }
  return linear(value);
}
window.linear = linear;
window.ease = ease;
window.easeIn = easeIn;
window.easeOut = easeOut;
window.easeInOut = easeInOut;
