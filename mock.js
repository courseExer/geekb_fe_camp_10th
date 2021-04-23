export function repeater(str, num) {
  str += "";
  str = str || "1";
  num = num || 1;
  return String.prototype.repeat.call(str, num);
}
export function sequencer(num) {
  const arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let str = "";
  for (let i = 0; i < num; i++) {
    const index = i % arr.length;
    str += arr[index];
  }
  return str;
}
