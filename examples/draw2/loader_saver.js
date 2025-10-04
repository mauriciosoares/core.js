export { start };
import { WANT_LOAD, LOAD,SAVE, WANTS_SAVE } from "./eventNames.js";
import { 
    abstractLines,
    snowMan,
    flower,
} from "./settings/saved_drawings.js";

const start = function (emitter) {
    let save;
    const map = {
        1: abstractLines,
        2: snowMan,
        3: flower,
    };
    emitter.on(WANT_LOAD, (id) => {
        if (map[id]) {
            emitter.emit(LOAD, map[id]);
        }
        if (Number(id) === 4 && save) {
            emitter.emit(LOAD, save);
        }
    });
    emitter.on(WANTS_SAVE, (data) => {
        save = data;
        emitter.emit(SAVE);
    });
};


