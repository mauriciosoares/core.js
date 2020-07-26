import { Core, useDefaultLogging, stopEventRecorder, startEventRecorder, replayEvents } from "../../dist/core.es.js";

import { LOAD, WANTS_SAVE, SAVE, TRAVEL_TIME, RESUME, WANTS_TRAVEL_TIME } from "./eventNames.js";

import * as draw from "./draw.js";
import * as gameOfLife from "./gameOfLife.js";
import * as input from "./input.js";
import * as loader from "./loader.js";
import * as saver from "./saver.js";
import * as gameLoop from "./gameLoop.js";
import * as time from "./time.js";


const core = new Core();

useDefaultLogging(core);





let eventRecording;
let moduleInstanceNames = [];

const restart = async () => {
    stopEventRecorder(core, eventRecording);
    await Promise.all(moduleInstanceNames.map(moduleInstanceName => {
        return core.stop(moduleInstanceName);
    }));

    eventRecording = startEventRecorder(core);

    moduleInstanceNames = [
        await core.start(loader),
        await core.start(saver),
        await core.start(draw, {name: `draw`}),
        await core.start(gameOfLife, {name: `gameOfLife`}),
        await core.start(input, {name: `input`}),
        await core.start(time, {name: `time`}),
        await core.start(gameLoop, {name: `gameLoop`}),
    ]
    
};

const replay = async () => {
    const previousEvents = eventRecording.events;
    await restart();
    replayEvents(core, previousEvents, { sameSpeed: true, pauseEmits: true });
};


// test
// setTimeout(() => {
//     replay();
// },5000)



core.on(TRAVEL_TIME, async (destination) => {
    const previousEvents = eventRecording.events;
    let lastIndex = 0;
    previousEvents.every((event, i) => {
        const { name, data, time } = event;
        if (time > destination) {
            lastIndex = i;
            return false;
        }
        return true;
    });
    previousEvents.length = lastIndex;
    const withoutTimeEvents = previousEvents.filter(event => {
        return name !== TRAVEL_TIME && name !== WANTS_TRAVEL_TIME;
    });
    await restart();
    replayEvents(core, withoutTimeEvents, { sameSpeed: false });
    // does not need to emit resume as the event was recorded and replayed
});


restart().then(() => {
    core.moduleEmit(RESUME);
});