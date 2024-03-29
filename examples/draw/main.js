import { createCore, useDefaultLogging } from "../../dist/core.es.js";

import { LOAD, WANTS_SAVE, SAVE } from "./eventNames.js";

import * as draw from "./draw.js";
import * as input from "./input.js";
import * as loader from "./loader.js";
import * as saver from "./saver.js";


const core = createCore();

useDefaultLogging(core);

core.start(loader);
core.start(saver);
core.start(draw, {name: `draw`});
core.start(input, {name: `input`});

core.on(LOAD, async (drawState) => {
    await core.restoreAllStates({
        [`draw`]: drawState,
    });
});

core.on(WANTS_SAVE, async () => {
    const states = await core.getAllStates();
    core.moduleEmit(SAVE, states[`draw`]);
});
