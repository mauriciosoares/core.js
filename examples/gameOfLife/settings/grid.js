export {
    initialGrid,
    alive,
    dead,
    size,
};

const size = 12;
const dead = 0;
const alive = 1;
const deadRatio = 0.85;

// generate random grid
const initialGrid = [];

for (let i = 0; i < size; i += 1) {
  initialGrid.push([]);
  for (let j = 0; j < size; j += 1) {
    let cell = dead;
    if (Math.random() > deadRatio) {
      cell = alive;
    }
    initialGrid[i].push(cell);
  }
}
