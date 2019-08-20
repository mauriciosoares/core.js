import { Core } from "../../src/core/core.js";
// import {  } from "./eventNames.js";
// import { x, y } from "./dependencies.js";
// import { configuration } from "./configuration.js";

import * as tweetForm from "./tweet-form.js";
import * as tweetList from "./tweet-list.js";
import * as tweetCounter from "./tweet-counter.js";


const core = new Core();
core.start(tweetForm);
core.start(tweetList);
core.start(tweetCounter, { name: 'first counter' });
core.start(tweetCounter, { name: 'second counter' });


setTimeout(() => {
    core.stop('second counter');
}, 10 * 1000);
