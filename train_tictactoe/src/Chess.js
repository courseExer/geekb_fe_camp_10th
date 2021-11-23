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
    this.chessmanMap = [null, "black", "white"];
    this.chessman = 2;
    this.chess = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }
  render(root = this.root) {
    this.root = root;
    this.root.innerHTML = "";
    let elm_ul = document.createElement("ul");
    elm_ul.setAttribute("class", "chessboard");
    for (let row = 0; row < this.chess.length; row++) {
      for (let col = 0; col < this.chess.length; col++) {
        const status = this.chess[row][col];
        const attrValue = status === 1 ? "black" : status === 2 ? "white" : "";
        const elm_li = document.createElement("li");
        elm_li.setAttribute("class", attrValue);
        elm_ul.appendChild(elm_li);
        elm_li.addEventListener("click", () => this.move(row, col));
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
    this.chessman = this.getNextMan();
    this.chess[row][col] = this.chessman;
    this.render();
    if (this.checkWin()) {
      console.log(this.chessmanMap[this.chessman], "获胜!");
      return;
    }
    if (this.checkWillWin(this.getNextMan())) {
      console.log(this.chessmanMap[this.getNextMan()], "将要获胜!");
      return;
    }
  }
  getNextMan() {
    return this.chess.length - this.chessman;
  }
  checkWillWin(chessman) {
    {
      // 1.横向同色连子
      for (let row = 0; row < this.chess.length; row++) {
        if (isArrayItemWillSame(this.chess[row], chessman)) return chessman;
      }
    }
    {
      // 2.纵向同色连子
      const arr = getMirrorArray(this.chess);
      for (let row = 0; row < arr.length; row++) {
        if (isArrayItemWillSame(arr[row], chessman)) return chessman;
      }
    }
    {
      // 3.对角同色连子
      const arr = getDiagonalArray(this.chess);
      for (let row = 0; row < arr.length; row++) {
        if (isArrayItemWillSame(arr[row], chessman)) return chessman;
      }
    }
    return 0;
  }
  checkWin() {
    {
      // 1.横向同色连子
      for (let row = 0; row < this.chess.length; row++) {
        if (isArrayItemSame(this.chess[row])) return (this.win = this.chessman);
      }
    }
    {
      // 2.纵向同色连子
      const arr = getMirrorArray(this.chess);
      for (let row = 0; row < arr.length; row++) {
        if (isArrayItemSame(arr[row])) return (this.win = this.chessman);
      }
    }
    {
      // 3.对角同色连子
      const arr = getDiagonalArray(this.chess);
      for (let row = 0; row < arr.length; row++) {
        if (isArrayItemSame(arr[row])) return (this.win = this.chessman);
      }
    }
    return 0;
  }
}
