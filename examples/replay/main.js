import { 
    Core,
    startEventRecorder,
    stopEventRecorder,
    replayEvents,
    useDefaultLogging,
} from "../../src/core.js";
// import {  } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";

import * as tweetForm from "../simple/tweet-form.js";
import * as tweetList from "../simple/tweet-list.js";
import * as tweetCounter from "../simple/tweet-counter.js";


const core = new Core();

// listen for all events
useDefaultLogging(core);

let eventRecording;
let moduleInstanceNames = [];

const restart = async () => {
    stopEventRecorder(core, eventRecording);
    await Promise.all(moduleInstanceNames.map(moduleInstanceName => {
        return core.stop(moduleInstanceName);
    }));

    eventRecording = startEventRecorder(core);

    const tweetFormName = await core.start(tweetForm);
    const tweetListName = await core.start(tweetList);
    const tweetCounterFirstName = await core.start(tweetCounter, { name: `first counter` });
    const tweetCounterSecondName = await core.start(tweetCounter, { name: `second counter` });
    moduleInstanceNames = [
        tweetFormName,
        tweetListName,
        tweetCounterFirstName,
        tweetCounterSecondName,
    ];
};

const replay = async () => {
    const previousEvents = eventRecording.events;
    await restart();
    replayEvents(core, previousEvents, { sameSpeed: true });
};
const controlZ =  async () => {
    const previousEvents = eventRecording.events;
    previousEvents.pop(); // forget last
    await restart();
    replayEvents(core, previousEvents, { sameSpeed: false });
};

document.getElementById(`undo`).addEventListener(`click`, controlZ);

restart();

setTimeout(replay, 10000);
setTimeout(controlZ, 20000);
