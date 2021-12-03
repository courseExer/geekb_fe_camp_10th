go = co(go);
go();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
function* go() {
  while (true) {
    console.log("step1");
    yield sleep(1000);
    console.log("step2");
    yield sleep(500);
    console.log("step3");
    yield sleep(1000);
  }
}
function run(iterator) {
  let { value, done } = iterator.next();
  if (done) return;
  if (value instanceof Promise) {
    value.then(() => {
      run(iterator);
    });
  }
}

function co(generator) {
  return function () {
    return run(generator());
  };
}
