// 早年没有async/await+promise，就用generator+promise去模拟

export class TrafficLight {
  constructor() {
    this.index = 0; // 0红灯，1黄灯，2绿灯
  }
  init(root) {
    this.root = root;
    const coTasks = co(this.tasks).bind(this);
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
  *tasks() {
    // while让状态走完了还能回到第一个状态，循环往复
    while (true) {
      this.red();
      yield sleep(2000);
      this.yellow();
      yield sleep(1000);
      this.green();
      yield sleep(2000);
    }
  }
}
// 下面三个方法和类没有直接关系，所以抽出来
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
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
    return run(generator.call(this));
  };
}
