export function typeIs(value) {
  return Object.toString.call(value).slice(1, -1).split(" ")[1];
}
