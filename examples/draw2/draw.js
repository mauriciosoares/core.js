export {start};
import { createCore, useDefaultLogging } from "../../dist/core.es.js";

import { LOAD, WANTS_SAVE, SAVE, WANT_LOAD,WANT_DRAW } from "./eventNames.js";

import * as draw from "./draw/canvas.js";
import * as input from "./draw/input.js";




const start = function (emitter) {
    const instance = {
        drawn: [],
      };
    const core = createCore();

    // useDefaultLogging(core);
        
    core.start(draw, {name: `draw`});
    core.start(input, {name: `input`});

    emitter.on(LOAD, async (drawState) => {
        instance.drawn = drawState.slice();
        await core.restoreAllStates({
            [`draw`]: drawState,
        });
    });

    core.on(WANTS_SAVE, async () => {
        emitter.emit(WANTS_SAVE, instance.drawn)
    });

    core.on(WANT_LOAD, async (id) => {
        emitter.emit(WANT_LOAD, id)
    });

    core.on(WANT_DRAW, (coordinates) => {
        instance.drawn.push(coordinates);
    });
};
