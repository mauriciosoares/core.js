export { start, stop  };
import { STATUS_CHANGED } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";

const start = function (emitter) {
  const span = document.getElementById(`status`);
  const instance = {
    span,
  };
  
  emitter.on(STATUS_CHANGED, (data) => {
    span.textContent = data;
  });
  
  
  return instance;
};

const stop = function (instance) {
  const { span } = instance;
  span.textContent = ``;
};
