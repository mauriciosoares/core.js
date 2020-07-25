export { start, stop };

import { period } from "./settings/game.js";
import { TICK, PAUSE, RESUME } from "./eventNames.js";


const start = (emitter) => {
    let intervalId = startInterval(emitter);
    emitter.on(PAUSE, () => {
        stop(intervalId);
    });
    emitter.on(RESUME, () => {
        intervalId = startInterval(emitter);
    });
    return intervalId;
};

const startInterval = (emitter) => {
    return setInterval(() => {
        emitter.emit(TICK);
    }, period);
}

const stop = (intervalId) => {
    clearInterval(intervalId);
};
