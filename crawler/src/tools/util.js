import { createHash } from "crypto";

export function typeIs(v) {
  const typeStr = Object.prototype.toString
    .call(v)
    .slice(1, -1)
    .toLowerCase()
    .split(" ");
  return typeStr[1];
}
export function getHash(v = "", len = 10, encoding = "sha256", digest = "hex") {
  const hash = createHash(encoding);
  hash.update(v);
  return hash
    .digest(digest)
    .replace(/[\/\\]/g, "")
    .slice(0, len);
}
export function url2filename(url = "", suffix = "html") {
  const urlObj = new URL(url);
  return `${urlObj.pathname.replace(/[\/]/g, "")}_${getHash(url)}.${suffix}`;
}
