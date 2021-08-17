export { createCore, ALL, ERROR };
export { startEventRecorder, stopEventRecorder } from "./eventRecorder.js";
export { replayEvents } from "./eventPlayer.js";
export { useDefaultLogging } from "./logging.js";
import EventEmitter from "event-e3";
import { deepCopyAdded } from "utilsac/deep.js";


const ALL = Symbol();
const ERROR = Symbol();

const createCore = function () {
    const core = {};

    core.paused = false;
    core.moduleInstances = new Map();
    EventEmitter(core);
    return Object.assign(core, {
        getState(name) {
            if (!core.moduleInstances.has(name)) {
                return Promise.reject(`module with name ${name} does not exist`);
            }

            const wrapper = core.moduleInstances.get(name);
            if (!wrapper.module.getState) {
                return Promise.resolve({});
            }
            return Promise.resolve().then(() => {
                return wrapper.module.getState(wrapper.instance);
            });
        },

        /* returns a promise with an object 
            as keys the names of the module instances
            as value the state received */
        getAllStates() {
            const promises = [];
            const names = []; // freeze names in case something is added ore removed while the promise is being resolved 
            core.moduleInstances.forEach((wrapper, name) => {
                promises.push(core.getState(name));
                names.push(name);
            });

            return Promise.all(promises).then((results) => {
                // Promise.all preserves order
                const resultsAsObject = {};
                results.forEach((result, i) => {
                    resultsAsObject[names[i]] = deepCopyAdded(result);
                });
                return resultsAsObject;
            });
        },

        restoreState (name, state) {
            if (!core.moduleInstances.has(name)) {
                return Promise.reject(`module with name ${name} does not exist`);
            }

            const wrapper = core.moduleInstances.get(name);
            if (!wrapper.module.restoreState) {
                return Promise.resolve();
            }
            return Promise.resolve().then(() => {
                const stateCopy = deepCopyAdded(state); // avoid mutations
                return wrapper.module.restoreState(wrapper.instance, stateCopy);
            });

        },

        restoreAllStates(states) {
            return Promise.all(Object.entries(states).map(([name, state]) => {
                return core.restoreState(name, state);
            }));
        },

        start(module, { name = Symbol(), data = undefined } = {}) {
            if (core.moduleInstances.has(name)) {
                return Promise.reject(`module with name ${name} already started`);
            }

            if (!module.start) {
                return Promise.reject(`module must have start defined`);
            }

            const emitter = new EventEmitter();

            emitter.emit = core.moduleEmit;

            return Promise.resolve().then(() => {
                return module.start(emitter, data);
            }).then(instance => {
                core.moduleInstances.set(name, {
                    module,
                    instance,
                    name,
                    emitter,
                });
            }).then(() => {
                return name;
            }).catch(errorModuleStart => {
                core.emit(ERROR, {
                    time: Date.now(),
                    phase: `module.start`,
                    error: errorModuleStart,
                });
            });
        },

        stop(name) {
            const wrapper = core.moduleInstances.get(name);

            if (!wrapper) {
                return Promise.resolve(false);
            }

            wrapper.emitter.off();

            return Promise.resolve().then(() => {
                core.moduleInstances.delete(name);
                if (wrapper.module.stop) {
                    wrapper.module.stop(wrapper.instance);
                }
            }).catch(errorModuleStop => {
                core.emit(ERROR, {
                    time: Date.now(),
                    phase: `module.stop`,
                    error: errorModuleStop,
                });
            }).then(() => {
                return true;
            });
        },

        moduleEmit(name, data) {
            if (core.paused) {
                return;
            }
            core.moduleEmitDirect(name, data);
        },

        moduleEmitDirect(name, data) {
            core.emit(name, data);
            core.emit(ALL, { name, data, time: Date.now() });
            core.moduleInstances.forEach(({ emitter }) => {
                try {
                    EventEmitter.prototype.emit.call(emitter, name, data);
                } catch (error) {
                    core.emit(ERROR, {
                        time: Date.now(),
                        phase: `module runtime (emitter.on)`,
                        error,
                    });
                }
            });
        },
    });
};
