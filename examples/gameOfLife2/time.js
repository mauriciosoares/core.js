export { start, stop };
import { TICK, WANTS_TRAVEL_TIME, TRAVEL_TIME } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";


const start = function (emitter, firstTick) {
    const instance = {
        firstTick,
        frame: 0,
        timePassed: 0,
    };
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
    
    const timer = document.getElementById(`time`);
    const msPerS = 1000;
    emitter.on(TICK, () => {
        const now = Date.now(); 
        instance.frame += 1;
        instance.timePassed = now - instance.firstTick;
        timer.textContent = `frame ${instance.frame} time ${Math.floor(instance.timePassed / msPerS)}s`;
    });

    emitter.on(WANTS_TRAVEL_TIME, float => {
        const destination = Date.now() - (instance.timePassed * (1 - float));
        const t = new Date();
        t.setTime(destination);
        console.log(`destination`, t.toLocaleTimeString());
        emitter.emit(TRAVEL_TIME, destination);
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
        saveAction,
        saveButton,
        slider,
        pauseButton,
        pauseAction,
        sliderAction,
        loaders,
        loaderAction,
    });
    return instance;
};



const stop = function (/*instance*/) {
};
