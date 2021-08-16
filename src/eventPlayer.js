export { replayEvents };


const replayEvents = (core, events, options = {}) => {
    if (!events.length) {
        return;
    }

    const { sameSpeed, pauseEmits = true } = options;
    if (pauseEmits) {
        core.paused = true;
    }

    if (sameSpeed) {
        return replayEventsSameSpeed(core, events);
    } 
        replayEventsInstantly(core, events);
        return Promise.resolve();
    
};

const replayEventsInstantly = (core, events) => {    
    events.forEach(event => {
        core.moduleEmitDirect(event.name, event.data);
    });
    core.paused = false;
};

const replayEventsSameSpeed = (core, events) => {
    return new Promise(function (resolve) {
        const { length } = events;
        let i = 0;
        const playNext = () => {
            const event = events[i];
            core.moduleEmitDirect(event.name, event.data);
            i += 1;
            if (i < length) {
                const timeDifference = events[i].time - event.time;
                setTimeout(playNext, timeDifference);
                return;
            }
            core.paused = false;
            resolve();
        };
        playNext();
    });
};
