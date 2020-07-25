export { start };
import { WANT_LOAD, LOAD } from "./eventNames.js";

const start = function (emitter) {
    const map = {

    };
    emitter.on(WANT_LOAD, (id) => {
        if (map[id]) {
            emitter.emit(LOAD, map[id]);
        }
    });
};
