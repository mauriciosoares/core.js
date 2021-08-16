export { start, stop, getState, restoreState };
import { WANT_DRAW } from "./eventNames.js";
import { alive/*, dead, size*/ } from "./settings/grid.js";
import { width, height, pixelSize } from "./settings/graphics.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";



const drawOne = function (context, coordinates) {
  const { x, y } = coordinates;
  context.fillStyle = `#FFFFFF`;
  context.beginPath();
  context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  context.fill();
};

const drawGrid = function (context, grid) {
  // clear
  context.fillStyle = `#000000`;
  context.fillRect(0, 0, width, height);
  // draw
  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell === alive) {
        drawOne(context, {x, y});
      }
    });
  });
};

const start = function (emitter) {
  const canvas = document.getElementById(`canvas`);
  const context = canvas.getContext(`2d`);
  const instance = {
    context,
  };
  canvas.width = width;
  canvas.height = height;
  
  emitter.on(WANT_DRAW, (grid) => {
    drawGrid(context, grid);
  });
  
  
  return instance;
};


const getState = function (instance) {
  return instance.drawn;
};

const restoreState = function (instance, state) {
  stop(instance);

};

const stop = function (instance) {
  const { context } = instance;
  context.fillRect(0, 0, width, height);
};
