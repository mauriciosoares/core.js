export { start, stop, getState, restoreState };
import { WANT_DRAW } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const width = 800;
const height = 600;

const draw = function (context, coordinates) {
  const { x1, y1, x2, y2 } = coordinates;
  context.beginPath();

  // context.arc(10, 10, 30, 0, Math.PI * 2);
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
};

const start = function (emitter) {
  const canvas = document.getElementById(`canvas`);
  const context = canvas.getContext('2d');
  const instance = {
    context,
    drawn: [],
  };
  canvas.width = width;
  canvas.height = height;


  context.fillStyle = '#000000';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#FFFFFF';
  emitter.on(WANT_DRAW, (coordinates) => {
    draw(context, coordinates);
    instance.drawn.push(coordinates);
  });
  return instance;
};

const getState = function (instance) {
  return instance.drawn;
};

const restoreState = function (instance, state) {
  stop(instance);
  instance.drawn = state;
  instance.drawn.forEach(coordinates => {
    draw(instance.context, coordinates);
  });
}

const stop = function (instance) {
  const { context } = instance;
  context.fillRect(0, 0, width, height);
};
