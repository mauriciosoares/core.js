export { start, stop, getState, restoreState };
import { WANT_DRAW } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const width = 800;
const height = 600;
const size = 10;
const initialGrid = [
  {x: 10, y: 10},
  {x: 11, y: 11},
  {x: 12, y: 11},
  {x: 13, y: 11},
  {x: 15, y: 15},
  {x: 15, y: 16},
]

const draw = function (context, coordinates) {
  const { x, y } = coordinates;
  console.log(x,y);
  context.fillStyle = `#FFFFFF`;
  context.beginPath();
  context.fillRect(x * size, y * size, size, size);
  context.fill();
};

const start = function (emitter) {
  const canvas = document.getElementById(`canvas`);
  const context = canvas.getContext(`2d`);
  const instance = {
    context,
    drawn: [],
  };
  canvas.width = width;
  canvas.height = height;


  context.fillStyle = `#000000`;
  context.fillRect(0, 0, width, height);
  initialGrid.forEach(coordinates => {
    draw(context, coordinates);
  });
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
};

const stop = function (instance) {
  const { context } = instance;
  context.fillRect(0, 0, width, height);
};
