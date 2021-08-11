export { start, stop };
import { STATUS_CHANGED, WANT_DRAW, WANT_LOAD, WANTS_SAVE, WANTS_TOGGLE, PAUSE, RESUME, WANTS_TRAVEL_TIME } from "./eventNames.js";
import { pixelSize } from "./settings/graphics.js";
import { createThrottled } from "./node_modules/utilsac/utility.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter) {
    const instance = {
        disabled: false,
    };
    startUiInput(emitter, instance);
    startDrawInput(emitter, instance);
    emitter.on(STATUS_CHANGED, (data) => {
        if (data === "ready") {
            enableAll(instance);
        }
    });
    return instance;
};

const startDrawInput = function (emitter, instance) {
    const canvas = document.getElementById(`canvas`);
    const onpointerdown = function (event) {
        if (instance.disabled) {
            return;
        }
        emitter.emit(WANTS_TOGGLE, {
            x: Math.round(event.offsetX  / pixelSize - 0.5), // take center of square
            y: Math.round(event.offsetY / pixelSize - 0.5),
        });
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
    const pauseAction = function (event) {
        if (paused) {
            emitter.emit(RESUME);
        } else {
            emitter.emit(PAUSE);
        }
    };
    pauseButton.addEventListener(`click`, pauseAction);
    emitter.on(PAUSE, () => {
        pauseButton.textContent = `RESUME`;
        paused = true;
    });
    emitter.on(RESUME, () => {
        pauseButton.textContent = `PAUSE`;
        paused = false;
    });

    const slider = document.getElementById(`slider`);
    slider.value = 100;
    const sliderAction = createThrottled(function (event) {
        emitter.emit(WANTS_TRAVEL_TIME, event.target.value / 100);
        disableAll(instance);
        // let input and onchange event finish
        setTimeout(() => {
            event.target.value = 100;
        }, 1000);
    }, 1200);
    slider.addEventListener(`input`, sliderAction);
    return Object.assign(instance, {
        slider,
        pauseButton,
        pauseAction,
        sliderAction,
    });
};

const stop = function (instance) {
    const { 
        slider,
        pauseButton,
        onpointerdown,
        pauseAction,
        sliderAction,
        canvas,
    } = instance;
    canvas.removeEventListener(`pointerdown`, onpointerdown);
    slider.removeEventListener(`input`, sliderAction);
    pauseButton.removeEventListener(`click`, pauseAction);
};

const disableAll = function (instance) {
    instance.disabled = true;
    instance.slider.disabled = true;
    instance.pauseButton.disabled = true;
};

const enableAll = function (instance) {
    instance.disabled = false;
    instance.slider.disabled = false;
    instance.pauseButton.disabled = false;
};
