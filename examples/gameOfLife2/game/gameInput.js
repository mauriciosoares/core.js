export { start, stop };
import { STATUS_CHANGED, WANT_LOAD, WANTS_SAVE, WANTS_TOGGLE, PAUSE, RESUME, WANTS_TRAVEL_TIME } from "../eventNames.js";
import { pixelSize } from "./settings/graphics.js";

// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter) {
    const instance = {
        disabled: false,
    };
    startDrawInput(emitter, instance);
    emitter.on(STATUS_CHANGED, (data) => {
        if (data === `ready`) {
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


const stop = function (instance) {
    const {
        saveAction,
        saveButton,
        slider,
        pauseButton,
        onpointerdown,
        pauseAction,
        sliderAction,
        canvas,
        loaders,
        loaderAction,
    } = instance;
    saveButton.removeEventListener(`click`, saveAction);
    canvas.removeEventListener(`pointerdown`, onpointerdown);
    slider.removeEventListener(`input`, sliderAction);
    pauseButton.removeEventListener(`click`, pauseAction);
    pauseButton.removeEventListener(`click`, pauseAction);
    loaders.forEach(function (loader) {
        loader.removeEventListener(`click`, loaderAction);
    });
};

const disableAll = function (instance) {
    instance.disabled = true;
    instance.saveButton.disabled = true;
    instance.slider.disabled = true;
    instance.pauseButton.disabled = true;
    instance.loaders.forEach(function (loader) {
        loader.disabled = true;
    });
};

const enableAll = function (instance) {
    instance.saveButton.disabled = false;
    instance.disabled = false;
    instance.slider.disabled = false;
    instance.pauseButton.disabled = false;
    instance.loaders.forEach(function (loader) {
        loader.disabled = false;
    });
};
