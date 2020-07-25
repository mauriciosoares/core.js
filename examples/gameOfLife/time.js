export { start, stop };
import { TICK } from "./eventNames.js";
import { pixelSize } from "./settings/graphics.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter) {
    const instance = {
        firstTick: Date.now(),

        timePassed: 0
    };
    let paused = false;
    const slider = document.getElementById(`slider`);
    const timer = document.getElementById(`time`);
    emitter.on(TICK, () => {
        const now = Date.now();
        const timePassed = now - instance.firstTick;
        timer.textContent = Math.floor(timePassed / 1000);
    });
    // pauseButton.addEventListener(`click`, function (event) {
    //     if (paused) {
    //         emitter.emit(RESUME);
    //     } else {
    //         emitter.emit(PAUSE);
    //     }
    //     paused = !paused;
    // });
    return instance;
};



const stop = function (instance) {
    const { 
        // onpointerdown,
    } = instance;
    // canvas.removeEventListener(`pointerdown`, onpointerdown);
};
