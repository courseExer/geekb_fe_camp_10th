// 异步的迭代器 ,与之匹配的读卡器是 for await of语法
async function* counter() {
  let index = 0;
  while (true) {
    await sleep(1000);
    yield index++;
    if (index === 3) break;
  }
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
// 读卡器
// async function read() {
//   for await (let item of counter()) {
//     console.log(item);
//   }
// }
// read();

// 或者这样写
(async function read() {
  for await (let item of counter()) {
    console.log(item);
  }
})();
