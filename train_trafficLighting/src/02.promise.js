// 使用链式方式书写异步代码
export class TrafficLight {
  constructor() {
    this.ms = [2000, 1000, 2000];
    this.index = 0; // 0红灯，1黄灯，2绿灯
  }
  init(root) {
    this.root = root;
    this.run();
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
  sleep(t) {
    return new Promise((resolve) => {
      setTimeout(resolve, t);
    });
  }
  run() {
    this.red();
    this.sleep(2000)
      .then(() => {
        this.yellow();
        return this.sleep(1000);
      })
      .then(() => {
        this.green();
        return this.sleep(2000);
      })
      .then(() => this.run());
  }
}
