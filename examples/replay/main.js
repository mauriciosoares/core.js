import { 
    Core,
    startEventRecorder,
    stopEventRecorder,
    replayEvents,
    useDefaultLogging,
} from "../../dist/core.es.js";
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
const initialTweetsInHtml = 1;

const restart = async (initialCount = 0) => {
    stopEventRecorder(core, eventRecording);
    await Promise.all(moduleInstanceNames.map(moduleInstanceName => {
        return core.stop(moduleInstanceName);
    }));

    eventRecording = startEventRecorder(core);

    const tweetFormName = await core.start(tweetForm);
    const tweetListName = await core.start(tweetList);
    const tweetCounterFirstName = await core.start(tweetCounter, { name: `first counter`, data: initialCount});
    moduleInstanceNames = [
        tweetFormName,
        tweetListName,
        tweetCounterFirstName,
    ];
};
const controlZ = async () => {
    const previousEvents = eventRecording.events;
    // omit this and the function is basically a replay
    previousEvents.pop(); // forget last
    await restart();
    replayEvents(core, previousEvents, { sameSpeed: false });
};

// const replay = async () => {
//     const previousEvents = eventRecording.events;
//     await restart();
//     replayEvents(core, previousEvents, { sameSpeed: true });
// };

document.getElementById(`undo`).addEventListener(`click`, controlZ);

restart(initialTweetsInHtml);
