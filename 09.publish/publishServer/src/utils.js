const { URL } = require("url");

function convertBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes == 0) {
    return "n/a";
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  if (i == 0) {
    return bytes + " " + sizes[i];
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

function deserializeUrl(req) {
  const object = new URL(`unknown:\/\/${req.headers.host}${req.url}`);
  const { hostname, port, pathname, searchParams } = object;

  let result = {
    hostname,
    port,
    pathname,
    searchParams: {},
  };

  for (let param of searchParams) {
    result.searchParams[param[0]] = param[1];
  }

  return result;
}

module.exports = {
  convertBytes,
  deserializeUrl,
};
