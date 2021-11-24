import {
  isArrayItemSame,
  isArrayItemWillSame,
  getMirrorArray,
  getDiagonalArray,
} from "./lib.js";
export class Chess {
  constructor() {
    this.win = 0;
    // 0空，1黑子，2白子
    this.colorMap = [null, "black", "white"];
    this.color = 2;
    this.chess = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }
  init(root) {
    this.root = root;
    this.render()
  }
  render(root = this.root) {
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
    if (this.win) return;
    if (this.chess[row][col]) {
      console.log("请选择空白处落子");
      return;
    }
    this.color = this.getNextColor();
    this.chess[row][col] = this.color;
    this.render();
    if (this.checkWin()) {
      console.log(this.colorMap[this.color], "获胜!");
      return;
    }
    if (this.checkWin(1, this.getNextColor())) {
      console.log(this.colorMap[this.getNextColor()], "将要获胜!");
      return;
    }
  }
  getNextColor() {
    return this.chess.length - this.color;
  }
  checkWin(step = 0, color = this.color) {
    // 1.横向同色
    for (let row = 0; row < this.chess.length; row++) {
      if (step === 0 && isArrayItemSame(this.chess[row]))
        return (this.win = this.color);
      if (step === 1 && isArrayItemWillSame(this.chess[row], color))
        return color;
    }

    // 2.纵向同色
    const mirrorArr = getMirrorArray(this.chess);
    for (let row = 0; row < mirrorArr.length; row++) {
      if (step === 0 && isArrayItemSame(mirrorArr[row]))
        return (this.win = this.color);
      if (step === 1 && isArrayItemWillSame(mirrorArr[row], color))
        return color;
    }

    // 3.对角同色
    const diagonalArr = getDiagonalArray(this.chess);
    for (let row = 0; row < diagonalArr.length; row++) {
      if (step === 0 && isArrayItemSame(diagonalArr[row]))
        return (this.win = this.color);
      if (step === 1 && isArrayItemWillSame(diagonalArr[row], color))
        return color;
    }

    return 0;
  }
}
