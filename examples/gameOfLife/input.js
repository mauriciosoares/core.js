export { start, stop };
import { STATUS_CHANGED, WANT_LOAD, WANTS_SAVE, WANTS_TOGGLE, PAUSE, RESUME, WANTS_TRAVEL_TIME } from "./eventNames.js";
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

const startUiInput = function (emitter, instance) {
    let paused = false;
    const pauseButton = document.getElementById(`pause`);
    const pauseAction = function () {
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
    const saveButton = document.getElementById(`save`);
    const saveAction = function () {
        emitter.emit(WANTS_SAVE);
    };
    saveButton.addEventListener(`click`, saveAction);

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

    const loaderDiv = document.getElementById(`loaders`);
    const loaders = [...loaderDiv.children].filter(x => {
        return x?.tagName === `BUTTON`;
    });
    const loaderAction = function(event) {
        const thingToLoad = event.target.getAttribute(`data-id`);
        emitter.emit(WANT_LOAD, thingToLoad);
    };
    loaders.forEach(function (loader) {
        loader.addEventListener(`click`, loaderAction);
    });
    return Object.assign(instance, {
        saveAction,
        saveButton,
        slider,
        pauseButton,
        pauseAction,
        sliderAction,
        loaders,
        loaderAction,
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
