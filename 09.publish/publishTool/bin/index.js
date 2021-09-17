#!/usr/bin/env node
const pkgDir = require("pkg-dir");
const app = require("../src/index.js");

(async function main() {
  await env();
  app();
})();

async function env() {
  process.env.PROJ_ROOT = await pkgDir(__dirname);
}
