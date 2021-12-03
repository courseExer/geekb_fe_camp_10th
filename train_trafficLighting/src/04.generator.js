// 早年没有async/await+promise，就用generator+promise去模拟

export class TrafficLight {
  constructor() {
    this.index = 0; // 0红灯，1黄灯，2绿灯
  }
  init(root) {
    this.root = root;
    const coTasks = co(tasks).bind(this);
    coTasks();
  }
  render() {
    const tpl = `<div class="light red ${this.index === 0 ? "show" : ""}"></div>
    <div class="light yellow ${this.index === 1 ? "show" : ""}"></div>
    <div class="light green ${this.index === 2 ? "show" : ""}"></div>`;
    this.root.innerHTML = tpl;
  }
  red() {
    this.index = 0;
    this.render();
  }
  yellow() {
    this.index = 1;
    this.render();
  }
  green() {
    this.index = 2;
    this.render();
  }
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
function* tasks() {
  while (true) {
    this.red();
    yield sleep(2000);
    this.yellow();
    yield sleep(1000);
    this.green();
    yield sleep(2000);
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
// co：该函数的能力是，把generator函数的yield当作await来处理
function co(generator) {
  return function () {
    return run(generator.call(this));
  };
}
