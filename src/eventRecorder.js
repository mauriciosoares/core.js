export { startEventRecorder, stopEventRecorder };

import { ALL } from "./core.js";


const startEventRecorder = (core) => {
    const events = [];
    const listener = event => {
        events.push(event);
    };
    core.on(ALL, listener);
    return {
        events,
        listener,
    };
};

const stopEventRecorder = (core, eventRecorder) => {
    if (!eventRecorder) {
        return;
    }
    const { listener } = eventRecorder;
    core.off(ALL, listener);
};
