/**
 * 类型判断
 * @param {any} v
 * @returns {any}
 */
function typeis(v) {
  return Object.prototype.toString
    .call(v)
    .slice(1, -1)
    .split(" ")[1]
    .toLowerCase();
}

module.exports = {
  typeis,
};
