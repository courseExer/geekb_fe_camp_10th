export function typeIs(value) {
  return Object.prototype.toString
    .call(value)
    .slice(1, -1)
    .split(" ")[1]
    .toLowerCase();
}
