// import assert from "assert";
// import { add } from "./util.js";
const assert = require("assert");
const add = require("./util.js").add;

describe("Testing add function", function () {
  it("add(1,2) should be 3", function () {
    assert.equal(add(1, 2), 3);
  });
});
