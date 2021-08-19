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
    return instance;
};



const stop = function (/*instance*/) {
};
