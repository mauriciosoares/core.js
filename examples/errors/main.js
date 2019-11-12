import { Core, ALL, ERROR } from "../../src/core.js";

import * as errorStart from "./errorStart.js";
import * as errorStop from "./errorStop.js";
import * as errorRuntime from "./errorRuntime.js";

const core = new Core();
// listen for all events
core.on(ALL, ({ name, data, time }) => {
    const timeString = new Date(time).toISOString();
    console.debug(`${timeString} event ${String(name)} with data`, data);
});

// listen for errors
core.on(ERROR, ({ time, phase, error }) => {
    const timeString = new Date(time).toISOString();
    console.error(`Error during phase ${phase} at ${timeString}`);
    console.error(error);
});

core.start(errorStart);
core.start(errorRuntime);
core.start(errorStop);

