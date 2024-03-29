export { start, stop, getState, restoreState };
import { WANT_DRAW, TICK, WANTS_TOGGLE, WANTS_SAVE, SAVE, LOAD } from "./eventNames.js";
// assume square (size)
import { initialGrid, alive, dead, size } from "./settings/grid.js";
import {deepCopy} from "./dependencies.js";

// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";
// SOURCE https://github.com/sklise/conways-game-of-life/blob/gh-pages/js/game.js + EDITS


//## Misc. Helper Functions

//### actualModulo
// Javascript doesn't have a proper "modulo" operator see [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Remainder)
// When % is passed a negative number for the divisor, the result is negative. For
// looping around arrays we always need positive values.

// example:

//     -1 % 15 === -1; // Desired result is 14
//     actualModulo(-1, 15) === 14
const actualModulo = function (divisor, dividend) {
  const fakeMod = divisor % dividend;

  if (fakeMod < 0) {
    return dividend + fakeMod;
  } 
    return fakeMod;
  
};

const start = function (emitter) {
  const instance = {
    grid: deepCopy(initialGrid),
    size,
  };

  
  emitter.on(TICK, () => {
    instance.grid = evolveGrid(deepCopy(instance.grid));
    emitter.emit(WANT_DRAW, instance.grid);
  });

  emitter.on(WANTS_SAVE, () => {
    emitter.emit(SAVE, instance.grid);
  });

  emitter.on(LOAD, (data) => {
    instance.grid = data;
    instance.size = data.length;
    emitter.emit(WANT_DRAW, instance.grid);
  });

  emitter.on(WANTS_TOGGLE, ({x, y}) => {
    if (x >= instance.size || y >= instance.size) {
      return; // out of scope
    }
    instance.grid = toggleCell(deepCopy(instance.grid), Math.abs(x), Math.abs(y));
    emitter.emit(WANT_DRAW, instance.grid);
  });
  return instance;
};

const toggleCell = (grid, x, y) => {
  grid[x][y] = Number(!grid[x][y]);
  return grid;
};

// Get the sum of the neighbors of a cell. Given the entire world array, width and
// height precomputed to save on lenght lookups and the x and y coordinate of the cell.
// Loops around the edges.
const sumNeighbors = function (cells, w, h, x, y) {
  return cells[y][actualModulo(x - 1, w)] + cells[y][actualModulo(x + 1, w)] + cells[actualModulo(y - 1, h)][x] + cells[actualModulo(y + 1, h)][x] + cells[actualModulo(y - 1, h)][actualModulo(x - 1, w)] + cells[actualModulo(y - 1, h)][actualModulo(x + 1, w)] + cells[actualModulo(y + 1, h)][actualModulo(x - 1, w)] + cells[actualModulo(y + 1, h)][actualModulo(x + 1, w)];
};

// Count up neighbors;
const census = function (grid, width, height) {
  const newNeighborCounts = buildArray(width, height, function() {
     return 0;
  });
  grid.forEach(function(rowArray, yIndex) {
    rowArray.forEach(function(cellState, xIndex) {
      newNeighborCounts[yIndex][xIndex] = sumNeighbors(grid, width, height, xIndex, yIndex);
    });
  });

  return newNeighborCounts;
};

// Create a two dimensional array given two dimensions and a function to fill the array
// the predicate function is passed the x and y coordinates of the array position.
const buildArray = function (w, h, pred) {
  const arr = Array(h);
  for (let i = 0; i < h; i += 1) {
    const arrRow = Array(w);
    for (let j = 0; j < w; j += 1) {
      arrRow[j] = pred(j,i);
    }
    arr[i] = arrRow;
  }
  return arr;
};

const nextGeneration = function (grid, neighborCounts) {
  grid.forEach(function(rowArray, yIndex) {
    rowArray.forEach(function(cellState, xIndex) {
      // const cellState = grid[yIndex][xIndex];
      const count = neighborCounts[yIndex][xIndex];
      // If the cell has the proper number of neighbors to turn from dead to alive set
      // the cell to alive. Else, if the cell is currently alive and meets the
      // requirements to die, set the cell to dead. In all other cases do not update the
      // state of the cell.
      if (count === 3) {
        grid[yIndex][xIndex] = alive;
      } else if (cellState === 1 && (count < 2 || count > 3)) {
        grid[yIndex][xIndex] = dead;
      }
    });
  });

  return grid;
};

const evolveGrid = (grid) => {
  // assume square (grid.length)
  const neighborCounts = census(grid, grid.length, grid.length);
  grid = nextGeneration(grid, neighborCounts);
  return grid;
};

const getState = function (instance) {
  return instance;
};

const restoreState = function (/*instance, state*/) {
};

const stop = function (/* instance */) {
};
