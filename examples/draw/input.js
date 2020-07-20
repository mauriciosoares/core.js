export { start, stop };
import { WANT_DRAW, WANT_LOAD } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter) {
    const instance = {};
    startUiInput(emitter, instance);
    startDrawInput(emitter, instance);
    return instance;
};

const startDrawInput = function (emitter, instance) {
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
    return Object.assign(instance, { 
        onpointerdown,
        onpointerup,
        canvas,
    });  
};

const startUiInput = function (emitter, instance) {
    for (let i = 1; i < 4; i += 1) {
        const loadButton = document.getElementById(String(i));
        const onLoadClick = function (event) {
            emitter.emit(WANT_LOAD, i);
        };
        loadButton.addEventListener(`click`, onLoadClick);
    }

    
    const saveButton = document.getElementById(`save`);
    loadButton.addEventListener(`click`, function (event) {
        emitter.emit(WANT_SAVE);
    });
};

const stop = function (instance) {
    const { 
        onpointerdown,
        onpointerup,
        canvas,
    } = instance;
    canvas.removeEventListener(`pointerdown`, onpointerdown);
    canvas.removeEventListener(`pointerup`, onpointerup);
};
