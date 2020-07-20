export { start };
import { WANT_LOAD, LOAD, WANTS_SAVE } from "./eventNames.js";


const start = function (emitter) {
    let save;
    emitter.on(WANT_LOAD, (id) => {
        if (Number(id) === 4 && save) {
            emitter.emit(LOAD, map[id]);
        }
    });
    emitter.on(SAVE, (data) => {
        console.log('saved');
        console.log(data);
        save = data;
    });
};
