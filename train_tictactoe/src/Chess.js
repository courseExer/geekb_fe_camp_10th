import {
  isArrayItemSame,
  isArrayItemWillSame,
  getMirrorArray,
  getDiagonalArray,
} from "./lib.js";
export class Chess {
  constructor() {
    // 0进行中,1黑胜,2白胜,-1和棋
    this.status = 0;
    this.colorMap = ["", "black", "white"];
    // 0空,1黑,2白
    this.color = 2;
    this.chess = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }
  init(root) {
    this.root = root;
    this.render();
  }
  render() {
    this.root.innerHTML = "";
    let elm_ul = document.createElement("ul");
    elm_ul.setAttribute("class", "chessboard");
    for (let row = 0; row < this.chess.length; row++) {
      for (let col = 0; col < this.chess.length; col++) {
        const attrValue = this.colorMap[this.chess[row][col]];
        const elm_li = document.createElement("li");
        elm_li.setAttribute("class", attrValue);
        elm_li.addEventListener("click", () => this.move(row, col));
        elm_ul.appendChild(elm_li);
      }
    }
    this.root.appendChild(elm_ul);
  }
  move(row, col) {
    if (this.status) return;
    if (this.chess[row][col]) return console.log("请选择空白处落子");
    // next color
    this.color = this.getNextColor();
    this.chess[row][col] = this.color;
    this.render();
    // 检验
    if (this.checkWin() === -1) return console.log("和棋!");
    if (this.checkWin() > 0)
      return console.log(this.colorMap[this.color], "获胜!");
    if (this.checkWin(1, this.getNextColor()) > 0)
      return console.log(this.colorMap[this.getNextColor()], "将要获胜!");
    if (this.checkWin(1, this.color) > 0)
      return console.log(this.colorMap[this.color], "将要获胜!");
  }
  getNextColor() {
    return this.chess.length - this.color;
  }
  checkWin(step = 0, color = this.color) {
    // 1.横向同色
    for (let row = 0; row < this.chess.length; row++) {
      if (step === 0 && isArrayItemSame(this.chess[row]))
        return (this.status = this.color);
      if (step === 1 && isArrayItemWillSame(this.chess[row], color))
        return color;
    }
    // 2.纵向同色
    const mirrorArr = getMirrorArray(this.chess);
    for (let row = 0; row < mirrorArr.length; row++) {
      if (step === 0 && isArrayItemSame(mirrorArr[row]))
        return (this.status = this.color);
      if (step === 1 && isArrayItemWillSame(mirrorArr[row], color))
        return color;
    }
    // 3.对角同色
    const diagonalArr = getDiagonalArray(this.chess);
    for (let row = 0; row < diagonalArr.length; row++) {
      if (step === 0 && isArrayItemSame(diagonalArr[row]))
        return (this.status = this.color);
      if (step === 1 && isArrayItemWillSame(diagonalArr[row], color))
        return color;
    }
    // 0.和棋
    if (this.chess.every((arr) => arr.every((item) => item !== 0)))
      return (this.status = -1);
    return 0;
  }
}
