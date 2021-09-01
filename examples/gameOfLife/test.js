// @ts-check
export { start };
// import { WANT_DRAW, TICK, WANTS_TOGGLE, WANTS_SAVE, SAVE, LOAD } from "./eventNames.js";
// import { WANT_DRAW, TICK, WANTS_TOGGLE, WANTS_SAVE, SAVE, LOAD } from "http://localhost:8080/examples/gameOfLife/eventNames.js";
// import { WANT_DRAW, TICK, WANTS_TOGGLE, WANTS_SAVE, SAVE, LOAD } from "/examples/gameOfLife/eventNames.js";

// import { initialGrid, alive, dead, size } from "./settings/grid.js";
// import {deepCopy} from "./dependencies.js";

const start = function (emitter) {
  console.log(import.meta.url);
  const instance = {

  };

  emitter.emit("x", "from test.js")
  emitter.on("WANT_DRAW", console.log)
  return instance;
};


// const stop = function (/* instance */) {
// };
