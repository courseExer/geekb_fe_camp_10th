/**
 * 获取打开页面的特定节点的相关信息
 * @return{
 *  title,
 *  props,
 * }
 * Prop:{
 *  name,
 *  href,
 *  status, // Number:0 normal,1experimental,2deprecated,
 * }
 */
const statusMap = ["normal", "experimental", "deprecated"];
const typeMap = ["property", "class", "method"];
function getUlProps(ulElm) {
  const lis = ulElm.getElementsByTagName("li");
  const props = Array.prototype.map.call(lis, (li) => {
    const linkElm = li.getElementsByTagName("a")[0] || li;
    const href = linkElm === li ? "" : linkElm.href;
    const name = linkElm.getElementsByTagName("code")[0].textContent;
    const status =
      linkElm === li
        ? statusMap[2]
        : linkElm.nextElementSibling === null
        ? statusMap[0]
        : linkElm.nextElementSibling.classList[1].split("-")[1];
    const type = /^[A-Z]/.test(name)
      ? typeMap[1]
      : /\(\)$/.test(name)
      ? typeMap[2]
      : typeMap[0];
    return {
      name,
      type,
      status,
      href,
    };
  });
  return props;
}
function getDlLinks(dlElm) {
  const dts = dlElm.getElementsByTagName("dt");
  const props = Array.prototype.map.call(dts, (dt) => {
    const linkElm = dt.getElementsByTagName("a")[0] || dt;
    const href = linkElm === dt ? "" : linkElm.href;
    const name = linkElm.getElementsByTagName("code")[0]
      ? linkElm.getElementsByTagName("code")[0].textContent
      : linkElm.textContent;
    const status =
      linkElm === dt
        ? statusMap[2]
        : linkElm.nextElementSibling === null
        ? statusMap[0]
        : linkElm.nextElementSibling.classList[1].split("-")[1];
    const type = /^[A-Z]/.test(name)
      ? typeMap[1]
      : /\(\)$/.test(name)
      ? typeMap[2]
      : typeMap[0];
    return {
      name,
      type,
      status,
      href,
    };
  });
  return props;
}
