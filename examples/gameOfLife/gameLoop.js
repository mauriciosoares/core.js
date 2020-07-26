export { start, stop };

import { period } from "./settings/game.js";
import { TICK, PAUSE, RESUME } from "./eventNames.js";


const start = (emitter) => {
    const instance = {
        intervalId: undefined,
    };
    
    emitter.on(PAUSE, () => {
        stop(instance);
    });
    emitter.on(RESUME, () => {
        instance.intervalId = startInterval(emitter);
    });
    return instance;
};

const startInterval = (emitter) => {
    return setInterval(() => {
        emitter.emit(TICK);
    }, period);
};

const stop = (instance) => {
    if (instance.intervalId !== undefined) {
        clearInterval(instance.intervalId);
        instance.intervalId = undefined;
    }
};
