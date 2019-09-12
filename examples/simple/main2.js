import { Core, ALL } from "../../src/core.js";
import {
    startEventRecorder,
    stopEventRecorder,
} from "../../src/eventRecorder.js";
import { replayEvents } from "../../src/eventPlayer.js";
// import {  } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";

import * as tweetForm from "./tweet-form.js";
import * as tweetList from "./tweet-list.js";
import * as tweetCounter from "./tweet-counter.js";


const core = new Core();

// listen for all events
core.on(ALL, ({ name, data, time }) => {
    const timeString = new Date(time).toISOString();
    console.debug(`${timeString} event ${String(name)} with data`, data);
});

let eventRecording;
let moduleInstanceNames = [];

const restart = () => {
    stopEventRecorder(core, eventRecording);
    moduleInstanceNames.forEach(moduleInstanceName => {
        core.stop(moduleInstanceName);
    });

    eventRecording = startEventRecorder(core);

    const tweetFormName = core.start(tweetForm);
    const tweetListName = core.start(tweetList);
    const tweetCounterFirstName = core.start(tweetCounter, { name: `first counter` });
    const tweetCounterSecondName = core.start(tweetCounter, { name: `second counter` });
    moduleInstanceNames = [
        tweetFormName,
        tweetListName,
        tweetCounterFirstName,
        tweetCounterSecondName,
    ];
};

restart();


// stop a module
setTimeout(() => {
    console.info(`stopping the second tweet counter`);
    core.stop(`second counter`);
}, 5 * 1000);


setTimeout(() => {
    const previousEvents = eventRecording.events;
    restart();
    replayEvents(core, previousEvents, { sameSpeed: true });
}, 10000);