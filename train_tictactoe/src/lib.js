// 判断数组成员是否都相等（不为0）
export function isArrayItemSame(arr) {
  return arr.every((item) => {
    return item > 0 && item === arr[0];
  });
}
// 判断数组成员是否将要相同（即只有一个0）
export function isArrayItemWillSame(arr, color) {
  const filteredArr = arr.filter((item) => item !== 0);
  if (arr.length - filteredArr.length !== 1) return false;
  if (filteredArr.every((item) => item === color)) return true;
  return false;
}
// 二维数组进行对角线镜像
export function getMirrorArray(array) {
  let newArr = [];
  const len_row = array.length;
  let len_col = array[0].length;
  for (let row = 0; row < len_row; row++) {
    for (let col = 0; col < len_col; col++) {
      if (newArr[col] === void 0) newArr[col] = [];
      newArr[col].push(array[row][col]);
    }
  }
  return newArr;
}
// 获取二维数组当中的对角线成员
export function getDiagonalArray(array) {
  let oneArray = [];
  let twoArray = [];
  const len_row = array.length;
  let len_col = array[0].length;
  for (let row = 0; row < len_row; row++) {
    for (let col = 0; col < len_col; col++) {
      const value = array[row][col];
      if (row + col === 2) oneArray.push(value);
      if (row === col) twoArray.push(value);
    }
  }
  return [oneArray, twoArray];
}
