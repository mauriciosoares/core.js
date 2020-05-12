export { start, stop };
import { WANT_DRAW } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter) {
    let x1 = 0;
    let y1 = 0;  
    const canvas = document.getElementById(`canvas`);
    const onpointerdown = function (event) {
        x1 = event.clientX;
        y1 = event.clientY;
    };
    const onpointerup = function (event) {
        emitter.emit(WANT_DRAW, {
            x1,
            y1,
            x2: event.clientX,
            y2: event.clientY,
        });
    };
    canvas.addEventListener(`pointerdown`, onpointerdown);
    canvas.addEventListener(`pointerup`, onpointerup);
    const instance = { 
        onpointerdown,
        onpointerup,
    };
    return instance;
};

const stop = function (instance) {
    const { 
        onpointerdown,
        onpointerup,
    } = instance;
    canvas.removeEventListener(`pointerdown`, onpointerdown);
    canvas.removeEventListener(`pointerup`, onpointerup);
};
