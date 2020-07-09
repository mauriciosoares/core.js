export { start };
import { WANT_LOAD, LOAD } from "./eventNames.js";
import { 
    abstractLines,
    snowMan,
    flower,
} from "./settings/saved_drawings.js";

const start = function (emitter) {
    const map = {
        1: abstractLines,
        2: snowMan,
        3: flower,
    };
    emitter.on(WANT_LOAD, (id) => {
        emitter.emit(LOAD, map[id]);
    });
};
