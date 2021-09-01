// @ts-check
export { createCore, ALL, ERROR };
export { startEventRecorder, stopEventRecorder } from "./eventRecorder.js";
export { replayEvents } from "./eventPlayer.js";
export { useDefaultLogging } from "./logging.js";

import EventEmitter from "event-e3";
import { deepCopyAdded } from "utilsac/deep.js";

import {
    CORE_ACTION_KEY,
    CORE_EVENT,
    CORE_START,
    CORE_STARTED,
    CORE_STOP,
    CORE_STOPPED,
    CORE_GET_STATE,
    CORE_SET_STATE,
    CORE_ERROR,
}  from "./workers.js";
import {workerGlueCode} from "../dist/tempWorkerGlueCode.js";

const ALL = Symbol();
const ERROR = Symbol();
const JS_MIME = { type: `text/javascript` };

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

        start(module, { 
            name = Symbol(),
            data = undefined,
            worker = false
        } = {}) {

            if (core.moduleInstances.has(name)) {
                return Promise.reject(`module with name ${String(name)} already started`);
            }

            if (worker) {
                return core.startWorker(module, name, data);
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

        startWorker(moduleUrl, name, data) {
            return new Promise(function (resolve, reject) {
                fetch(moduleUrl).then(response => {
                    return response.text();
                }).then(moduleCode => {
                    const workerCode = `${workerGlueCode};${moduleCode}`;
                    const workerBlob = new Blob([workerCode], JS_MIME);
                    const workerObjectURL = URL.createObjectURL(workerBlob);
                    const moduleInsideWorker = new Worker(workerObjectURL, {
                        type: "module",
                        name: String(name), // help debugging
                    });
                    
                    core.listenForWorkerMessage(name, moduleInsideWorker, resolve);
                    moduleInsideWorker.postMessage({
                        [CORE_ACTION_KEY]: CORE_START,
                        data
                    });
                }).catch(errorModuleStart => {
                    core.emit(ERROR, {
                        time: Date.now(),
                        phase: `module.CORE_START`,
                        error: errorModuleStart,
                    });
                });
            });

            
        },

        listenForWorkerMessage(name, worker, resolve) {
            worker.addEventListener(`message`, function (messageEvent)  {
                const message = messageEvent.data;
                if (!Object.prototype.hasOwnProperty.call(message, CORE_ACTION_KEY)) {
                    return;
                }
                const action = message[CORE_ACTION_KEY];
                if (action === CORE_STARTED) {
                    core.moduleInstances.set(name, {
                        worker,
                        name,
                        stopResolve: undefined,
                    });
                    resolve();
                    return;
                }
                if (action === CORE_EVENT) {
                    core.moduleEmit(message.name, message.data);
                    return;
                }
                if (action === CORE_STOPPED) {
                    const wrapper = core.moduleInstances.get(name);
                    if (wrapper?.stopResolve) {
                        wrapper.stopResolve();
                        wrapper.stopResolve = undefined;
                        worker.terminate();
                    }
                    return;
                }
                if (action === CORE_ERROR) {
                    core.emit(ERROR, message)
                    return;
                }
                // todo CORE_GET_STATE set State
            });
            // todo listen for errors
        },

        stop(name) {
            const wrapper = core.moduleInstances.get(name);

            if (!wrapper) {
                return Promise.resolve(false);
            }
            core.moduleInstances.delete(name);

            if (wrapper.worker) {
                return core.stopWorker(wrapper);
            }
            wrapper.emitter.off();

            return Promise.resolve().then(() => {
                if (wrapper.module.stop) {
                    return wrapper.module.stop(wrapper.instance);
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

        stopWorker(wrapper) {
            return new Promise(function (resolve, reject) {
                wrapper.stopResolve = resolve;
                wrapper.worker.postMessage({
                    [CORE_ACTION_KEY]: CORE_STOP
                });
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
            core.moduleInstances.forEach(({ emitter, worker }) => {
                if (!worker) {
                    try {
                        EventEmitter.prototype.emit.call(emitter, name, data);
                    } catch (error) {
                        core.emit(ERROR, {
                            time: Date.now(),
                            phase: `module runtime (emitter.on)`,
                            error,
                        });
                    }
                    return;
                }
                worker.postMessage({
                    [CORE_ACTION_KEY]: CORE_EVENT,
                    name,
                    data,
                });
                
            });
        },
    });
};
