#!/usr/bin/env node
const pkgDir = require("pkg-dir");
const publish = require("../src/index.js");

(async function main() {
  await env();
  publish();
})();

async function env() {
  process.env.PROJ_ROOT = await pkgDir(__dirname);
}
