function* go() {
  yield "jack";
  yield "rose";
  yield "mike";
  yield "foo";
  return "bar"; // 有意义吗？
}
function run(iterator) {
  const { value, done } = iterator.next();
  if (done) return;
  console.log(value);
  run(iterator);
}
run(go());
