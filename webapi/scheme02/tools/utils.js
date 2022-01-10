export function moduleName(meta) {
  return meta.url.split("/").pop().split(".")[0];
}
