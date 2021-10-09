import { createCore, useDefaultLogging, stopEventRecorder, startEventRecorder, replayEvents } from "../../dist/core.es.js";

import { WANTS_SAVE, SAVE, TRAVEL_TIME, RESUME, WANTS_TRAVEL_TIME, PAUSE, STATUS_CHANGED } from "./eventNames.js";

const simplestModule = `./test.js`;
import * as gameOfLife from "./gameOfLife.js";
// const gameOfLife = "./gameOfLife.js";
import * as draw from "./draw.js";
import * as status from "./status.js";
import * as input from "./input.js";
import * as loader from "./loader.js";
import * as saver from "./saver.js";
import * as gameLoop from "./gameLoop.js";
import * as timeModule from "./time.js";

const core = createCore();
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
        await core.start(timeModule, {data: firstTick}),
        await core.start(draw, {name: `draw`}),
        await core.start(gameOfLife, {name: `gameOfLife`/*, worker: true*/}),
        await core.start(simplestModule, {name: `simplestModule`, worker: true}),
    ];
};

const start  = async () => {
    await core.start(loader);
    await core.start(saver);
    await core.start(input);
    await core.start(gameLoop, {name: `gameLoop`});
    await core.start(status);
    await restart();
    core.moduleEmit(RESUME);
};

const metaEvents = [
    TRAVEL_TIME,
    WANTS_TRAVEL_TIME,
    WANTS_SAVE,
    SAVE,
    PAUSE,
    RESUME,
    STATUS_CHANGED,
];

core.on(TRAVEL_TIME, async (destination) => {
    core.moduleEmit(PAUSE);
    const previousEvents = eventRecording.events;
    const lastIndex = previousEvents.findIndex((event) => {
        const { /*name, data,*/ time } = event;
        // console.log(`${name} at ${time}`, time > destination);
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
    core.moduleEmit(STATUS_CHANGED, `replaying events`);
    await replayEvents(core, withoutTimeEvents, { sameSpeed: true });
    core.moduleEmit(STATUS_CHANGED, `ready`);
    
    core.moduleEmit(RESUME);
});


start().catch(console.error);
