import { createCore, useDefaultLogging } from "../../dist/core.es.js";

import * as errorStart from "./errorStart.js";
import * as errorStop from "./errorStop.js";
import * as errorRuntime from "./errorRuntime.js";
import * as errorEventListener from "./errorEventListener.js";


const core = createCore();

(async function () {
    useDefaultLogging(core);

    await core.start(errorStart);
    await core.start(errorRuntime);
    await core.start(errorEventListener);
    const stopName = await core.start(errorStop);

    // trigger errorEventListener
    core.moduleEmitDirect(`x`, {});

    await core.stop(stopName);
}());
