export class TrafficLight {
  constructor() {
    this.ms = [2000, 1000, 2000];
    this.index = 0; // 0红灯，1黄灯，2绿灯
  }
  init(root) {
    this.root = root;
    this.red();
  }
  render() {
    const tpl = `<div class="light red ${this.index === 0 ? "show" : ""}"></div>
    <div class="light yellow ${this.index === 1 ? "show" : ""}"></div>
    <div class="light green ${this.index === 2 ? "show" : ""}"></div>`;
    this.root.innerHTML = tpl;
  }
  red() {
    this.render();
    this.index = 1;
    setTimeout(() => this.yellow(), 2000);
  }
  yellow() {
    this.render();
    this.index = 2;
    setTimeout(() => this.green(), 1000);
  }
  green() {
    this.render();
    this.index = 0;
    setTimeout(() => this.red(), 2000);
  }
}
