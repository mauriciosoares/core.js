import { Core, ALL, ERROR } from "../../src/core.js";

import * as errorStart from "./errorStart.js";
import * as errorStop from "./errorStop.js";
import * as errorRuntime from "./errorRuntime.js";
import * as errorEventListener from "./errorEventListener.js";


const core = new Core();

(async function () {
    // listen for errors
    core.on(ERROR, ({ time, phase, error }) => {
        const timeString = new Date(time).toISOString();
        console.error(`Error during phase ${phase} at ${timeString}`);
        console.error(error);
    });

    await core.start(errorStart);
    await core.start(errorRuntime);
    await core.start(errorEventListener);
    const stopName = await core.start(errorStop);

    // trigger errorEventListener
    core.moduleEmitDirect(`x`, {});

    await core.stop(stopName);
}());
