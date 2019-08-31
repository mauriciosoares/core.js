export { replayEvents };


const replayEvents = (core, events) => {
    events.forEach(event => {
        core.moduleEmit(event.name, event.data);
    });
};
