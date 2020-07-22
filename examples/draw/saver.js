export { start };
import { WANT_LOAD, LOAD, SAVE } from "./eventNames.js";


const start = function (emitter) {
    let save;
    emitter.on(WANT_LOAD, (id) => {
        if (Number(id) === 4 && save) {
            emitter.emit(LOAD, save);
        }
    });
    emitter.on(SAVE, (data) => {
        save = data;
    });
};
