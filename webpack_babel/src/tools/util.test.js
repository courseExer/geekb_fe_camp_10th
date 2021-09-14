import assert from "assert";
import { add, mul } from "./util.js";

describe("Testing add function", function () {
  it("add(1,2) should be 3", function () {
    assert.equal(add(1, 2), 3);
  });
  it("mul(1,2) should be 2", function () {
    assert.equal(mul(1, 2), 2);
  });
});
