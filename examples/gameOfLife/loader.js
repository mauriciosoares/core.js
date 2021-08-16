export { start };
import { WANT_LOAD, LOAD } from "./eventNames.js";
import * as prebuilts from "./settings/prebuilts.js";

const start = function (emitter) {
    emitter.on(WANT_LOAD, (id) => {
        if (prebuilts[id]) {
            emitter.emit(LOAD, prebuilts[id]);
        }
    });
};
