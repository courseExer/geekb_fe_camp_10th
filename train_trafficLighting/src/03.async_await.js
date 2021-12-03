// 使用同步代码的语法来写异步代码
// 特定：
// - sleep函数也可以看作为一种async/await
// - sleep函数可以很方便更换为其他函数，比如happen
/*
happen(element,eventName){
  return new Promise((resolve) => {
      element.addEventListener(eventName,resolve,{once:true})
  });
}
 */

export class TrafficLight {
  constructor() {
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
  async run() {
    while (true) {
      this.red();
      await this.sleep(2000);
      this.yellow();
      await this.sleep(1000);
      this.green();
      await this.sleep(2000);
    }
  }
  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
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
