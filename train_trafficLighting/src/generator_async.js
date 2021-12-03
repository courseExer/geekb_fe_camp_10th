function* go() {
  yield "jack";
  yield sleep(1000);
  yield "rose";
  yield sleep(1000);
  yield "mike";
  yield sleep(1000);
  yield "foo";
  yield sleep(1000);
  return "bar"; // 有意义吗？
}
function run(iterator) {
  const { value, done } = iterator.next();
  if (done) return;
  if (value instanceof Promise) {
    value.then(() => {
      run(iterator);
    });
    return;
  }
  // todo
  console.log(value);
  run(iterator);
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
run(go());
