import { isArrayItemSame, getMirrorArray, getDiagonalArray } from "./lib.js";
export class Chess {
  constructor() {
    this.win = false;
    // 0空，1黑子，2白字
    this.chessmanMap = [null, "black", "white"];
    this.chessman = 1;
    this.chess = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 2],
    ];
  }
  render(root = this.root) {
    this.root = root;
    this.root.innerHTML = "";
    let elm_ul = document.createElement("ul");
    elm_ul.setAttribute("class", "chessboard");
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
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
    this.nextStep(row, col);
    if (this.check()) {
      console.log(this.chessmanMap[this.chessman], "获胜!");
    }
    this.render();
  }
  nextStep(row, col) {
    let chessman = this.chess[row][col];
    if (chessman) return;
    this.chessman = 3 - this.chessman;
    this.chess[row][col] = this.chessman;
  }
  check() {
    {
      // 1.横向检查
      for (let row = 0; row < this.chess.length; row++) {
        if (isArrayItemSame(this.chess[row])) return (this.win = true);
      }
    }
    {
      // 2.纵向检查
      const arr = getMirrorArray(this.chess);
      for (let row = 0; row < arr.length; row++) {
        if (isArrayItemSame(arr[row])) return (this.win = true);
      }
    }
    {
      // 3.对角检查
      const arr = getDiagonalArray(this.chess);
      for (let row = 0; row < arr.length; row++) {
        if (isArrayItemSame(arr[row])) return (this.win = true);
      }
    }
    return this.win;
  }
}
