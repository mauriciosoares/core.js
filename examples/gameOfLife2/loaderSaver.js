export { start };
import { WANT_LOAD, LOAD , SAVE} from "./eventNames.js";
import * as prebuilts from "./game/settings/prebuilts.js";

const start = function (emitter) {
    let save;
    emitter.on(WANT_LOAD, (id) => {
        if (prebuilts[id]) {
            emitter.emit(LOAD, prebuilts[id]);
        }
    });

    emitter.on(WANT_LOAD, (id) => {
        if (id === `SAVE` && save) {
            emitter.emit(LOAD, save);
        }
    });
    emitter.on(SAVE, (data) => {
        save = data;
    });
    const saveButton = document.getElementById(`save`);
    const saveAction = function () {
        emitter.emit(WANTS_SAVE);
    };
    saveButton.addEventListener(`click`, saveAction);

    const loaderDiv = document.getElementById(`loaders`);
    const loaders = [...loaderDiv.children].filter(x => {
        return x?.tagName === `BUTTON`;
    });
    const loaderAction = function(event) {
        const thingToLoad = event.target.getAttribute(`data-id`);
        emitter.emit(WANT_LOAD, thingToLoad);
    };
    loaders.forEach(function (loader) {
        loader.addEventListener(`click`, loaderAction);
    });
    return Object.assign(instance, {
        saveAction,
        saveButton,
        loaders,
        loaderAction,
    });
};
