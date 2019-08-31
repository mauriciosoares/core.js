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
    const {
        events,
        listener,
    } = eventRecorder;
    core.off(ALL, listener);
    events.length = 0;
};
