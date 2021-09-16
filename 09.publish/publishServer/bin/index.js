#!/usr/bin/env node
const pkgDir = require("pkg-dir");
const deploy = require("../src/index.js");

(async function main() {
  await env();
  deploy();
})();

async function env() {
  process.env.PROJ_ROOT = await pkgDir(__dirname);
}
