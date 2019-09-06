export { replayEvents };


const replayEvents = (core, events, options = {}) => {
    if (!events.length) {
        return;
    }

    const { sameSpeed } = options;
    if (!sameSpeed) {
        events.forEach(event => {
            core.moduleEmit(event.name, event.data);
        });
        return;
    }

    const { length } = events;
    let i = 0;
    const playNext = () => {
        const event = events[i];
        core.moduleEmit(event.name, event.data);
        i += 1;
        if (i === length) {
            return;
        }
        const timeDifference = events[i].time - event.time;
        setTimeout(playNext, timeDifference);
    };
    playNext();
};
