export { start, stop };
import { WANT_DRAW, WANT_LOAD, WANTS_SAVE, WANTS_TOGGLE, PAUSE, RESUME, WANTS_TRAVEL_TIME } from "./eventNames.js";
import { pixelSize } from "./settings/graphics.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter) {
    const instance = {};
    startUiInput(emitter, instance);
    startDrawInput(emitter, instance);
    return instance;
};

const startDrawInput = function (emitter, instance) {
    const canvas = document.getElementById(`canvas`);
    const onpointerdown = function (event) {
        emitter.emit(WANTS_TOGGLE, {
            x: Math.round(event.clientX  / pixelSize - 0.5), // take center of square
            y: Math.round(event.clientY / pixelSize - 0.5),
        })
    };

    canvas.addEventListener(`pointerdown`, onpointerdown);
    return Object.assign(instance, { 
        onpointerdown,
        canvas,
    });
};

const startUiInput = function (emitter, instance) {
    let paused = false;
    const pauseButton = document.getElementById(`pause`);
    pauseButton.addEventListener(`click`, function (event) {
        if (paused) {
            emitter.emit(RESUME);
        } else {
            emitter.emit(PAUSE);
        }
        paused = !paused;
    });

    const slider = document.getElementById(`slider`);
    slider.addEventListener(`input`, function (event) {
        emitter.emit(WANTS_TRAVEL_TIME, event.target.value / 100);
    });
};

const stop = function (instance) {
    const { 
        onpointerdown,
        canvas,
    } = instance;
    canvas.removeEventListener(`pointerdown`, onpointerdown);
};
