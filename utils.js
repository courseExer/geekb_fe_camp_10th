export function typeIs(value) {
  const typeStr = Object.prototype.toString.call(value).split(" ")[1];
  return typeStr.substring(0, typeStr.length - 1).toLowerCase();
}
