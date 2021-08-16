import { Core, useDefaultLogging } from "../../dist/core.es.js";
// import {  } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";

import * as tweetForm from "./tweet-form.js";
import * as tweetList from "./tweet-list.js";
import * as tweetCounter from "./tweet-counter.js";


const core = new Core();


const initialTweetsInHtml = 1;

// listen for all events
useDefaultLogging(core);

core.start(tweetForm);
core.start(tweetList);
core.start(tweetCounter, { name: `first counter`, data: initialTweetsInHtml });
// core.start(tweetCounter, { name: `second counter` });


// extras
// stop a module
// setTimeout(() => {
//     console.info(`stopping the second tweet counter`);
//     core.stop(`second counter`);
// }, 10 * 1000);
