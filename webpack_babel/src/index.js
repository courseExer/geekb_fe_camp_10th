import "./index.less";
import { App } from "./App.js";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<App />, document.getElementById("app"));

// if (module.hot) {
//   module.hot.accept("./index.js", function () {
//     // Do something with the updated library module...
//   });
// }
