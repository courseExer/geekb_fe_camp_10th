import React from "react";
import { add } from "./tools/util.js";

export function App(_c) {
  return (
    <div>
      <img src="/public/assets/avatar-1.jpg" />
      <h2>HomePage {add(1, 2)}</h2>
    </div>
  );
}
