import { Core, useDefaultLogging, stopEventRecorder, startEventRecorder, replayEvents } from "../../dist/core.es.js";

import { LOAD, WANTS_SAVE, SAVE, TRAVEL_TIME, RESUME, WANTS_TRAVEL_TIME, PAUSE, STATUS_CHANGED } from "./eventNames.js";

import * as draw from "./draw.js";
import * as status from "./status.js";
import * as gameOfLife from "./gameOfLife.js";
import * as input from "./input.js";
// import * as loader from "./loader.js";
// import * as saver from "./saver.js";
import * as gameLoop from "./gameLoop.js";
import * as time from "./time.js";
// import { deepCopy } from "./node_modules/utilsac/deep.js";


const core = new Core();
useDefaultLogging(core);


let eventRecording;
let moduleInstanceNamesToRestart = [];
const firstTick = Date.now(); // keep value after restarts

const restart = async () => {
    stopEventRecorder(core, eventRecording);
    await Promise.all(moduleInstanceNamesToRestart.map(moduleInstanceName => {
        return core.stop(moduleInstanceName);
    }));

    eventRecording = startEventRecorder(core);

    moduleInstanceNamesToRestart = [
        await core.start(time, {data: firstTick}),
        await core.start(draw, {name: `draw`}),
        await core.start(gameOfLife, {name: `gameOfLife`}),
    ];
};

const start  = async () => {
    // await core.start(loader);
    // await core.start(saver);
    await core.start(input);
    await core.start(gameLoop, {name: `gameLoop`});
    await core.start(status);
    await restart();
    core.moduleEmit(RESUME);
};

const metaEvents = [
    TRAVEL_TIME,
    WANTS_TRAVEL_TIME,
    WANTS_SAVE, //todo all load and save
    PAUSE,
    RESUME,
    STATUS_CHANGED,
];

core.on(TRAVEL_TIME, async (destination) => {
    core.moduleEmit(PAUSE);
    const previousEvents = eventRecording.events;
    const lastIndex = previousEvents.findIndex((event) => {
        const { name, data, time } = event;
        console.log(`${name} at ${time}`, time > destination);
        return time > destination;
    }) ;
    if (lastIndex !== -1) {
        // drop all events after
        previousEvents.length = lastIndex;
    }
    previousEvents.length = lastIndex;
    const withoutTimeEvents = previousEvents.filter(event => {
        const {name} = event;
        return !metaEvents.includes(name);
    });
    await restart();
    core.moduleEmit(STATUS_CHANGED, "replaying events");
    replayEvents(core, withoutTimeEvents, { sameSpeed: true });
    core.moduleEmit(STATUS_CHANGED, "ready");
    
    // core.moduleEmit(PAUSE);
    // does not need to emit resume as the event was recorded and replayed
});


start();
