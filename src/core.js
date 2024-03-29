// @ts-check
export { createCore, ALL, ERROR, prepareWorkerCode };
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

const prepareWorkerCode = function (moduleCodeAsIIFE) {
    return `${workerGlueCode};${moduleCodeAsIIFE}`;
};

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
            if (wrapper.worker) {
                return core.requestStateFromWorker(wrapper);
            }
            if (!wrapper.module.getState) {
                return Promise.resolve({});
            }
            return Promise.resolve().then(() => {
                return wrapper.module.getState(wrapper.instance);
            });
        },

        requestStateFromWorker(wrapper) {
            return new Promise(function (resolve, reject) {
                wrapper.getStateResolve = resolve;
                wrapper.worker.postMessage({
                    [CORE_ACTION_KEY]: CORE_GET_STATE,
                });
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
            if (wrapper.worker) {
                return core.restoreStateInWorker(wrapper);
            }
            if (!wrapper.module.restoreState) {
                return Promise.resolve();
            }
            return Promise.resolve().then(() => {
                const stateCopy = deepCopyAdded(state); // avoid mutations
                return wrapper.module.restoreState(wrapper.instance, stateCopy);
            });

        },
        
        restoreStateInWorker(wrapper) {
            return new Promise(function (resolve, reject) {
                wrapper.setStateResolve = resolve;
                wrapper.worker.postMessage({
                    [CORE_ACTION_KEY]: CORE_SET_STATE,
                });
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
            worker = false,
            workerReady = false,
        } = {}) {

            if (core.moduleInstances.has(name)) {
                return Promise.reject(`module with name ${String(name)} already started`);
            }
            
            if (worker) {
                return core.startWorker(module, name, data, workerReady);
            }
            
            if (!module.start) {
                return Promise.reject(`module must have start defined`);
            }
            
            const earlyWrapper = {
                module,
                name,
            };
            core.moduleInstances.set(name, earlyWrapper);
            

            const emitter = new EventEmitter();

            emitter.emit = core.moduleEmit;

            return Promise.resolve().then(() => {
                return module.start(emitter, data);
            }).then(instance => {
                Object.assign(earlyWrapper, {
                    instance,
                    emitter,
                });
            }).then(() => {
                return name;
            }).catch(errorModuleStart => {
                core.moduleInstances.delete(name);
                core.emit(ERROR, {
                    time: Date.now(),
                    phase: `module.start`,
                    error: errorModuleStart,
                });
            });
        },

        startWorker(moduleUrl, name, data, workerReady) {
            
            const earlyWrapper = {
                module: moduleUrl,
                name,
            };
            core.moduleInstances.set(name, earlyWrapper);
            
            return new Promise(function (resolve, reject) {
                let workerRessourcePromise;
                if (workerReady) {
                    workerRessourcePromise = Promise.resolve(moduleUrl);
                } else {
                    workerRessourcePromise = fetch(moduleUrl).then(response => {
                        return response.text();
                    }).then(moduleCode => {
                        const workerCode = prepareWorkerCode(moduleCode);
                        const workerBlob = new Blob([workerCode], JS_MIME);
                        const workerObjectURL = URL.createObjectURL(workerBlob);
                        return workerObjectURL;
                    });
                }
                workerRessourcePromise.then(workerRessource => {
                    
                    const moduleInsideWorker = new Worker(workerRessource, {
                        type: `module`,
                        name: String(name), // help debugging
                    });
                    
                    core.listenForWorkerMessage(name, moduleInsideWorker, resolve, earlyWrapper);
                    moduleInsideWorker.postMessage({
                        [CORE_ACTION_KEY]: CORE_START,
                        data,
                    });
                }).catch(errorModuleStart => {
                    core.moduleInstances.delete(name);
                    core.emit(ERROR, {
                        time: Date.now(),
                        phase: `module.CORE_START`,
                        error: errorModuleStart,
                    });
                });
            });

            
        },

        listenForWorkerMessage(name, worker, resolve, earlyWrapper) {
            worker.addEventListener(`message`, function (messageEvent)  {
                const message = messageEvent.data;
                if (!Object.prototype.hasOwnProperty.call(message, CORE_ACTION_KEY)) {
                    return;
                }
                const action = message[CORE_ACTION_KEY];
                if (action === CORE_STARTED) {
                    Object.assign(earlyWrapper, {
                        worker,
                        name,
                        stopResolve: undefined,
                    });
                    resolve();
                    return;
                }
                if (action === CORE_EVENT) {
                    core.moduleEmit(message.name, message.data, worker);
                    return;
                }
                if (action === CORE_ERROR) {
                    core.emit(ERROR, message);
                    return;
                }
                const wrapper = core.moduleInstances.get(name);
                if (action === CORE_STOPPED) {
                    if (wrapper?.stopResolve) {
                        wrapper.stopResolve();
                        wrapper.stopResolve = undefined;
                        worker.terminate();
                    }
                    return;
                }
                if (action === CORE_SET_STATE) {
                    if (wrapper?.getStateResolve) {
                        wrapper.getStateResolve(message.data || {});
                        wrapper.getStateResolve = undefined;
                    }
                    return;
                }
                if (action === CORE_GET_STATE) {
                    if (wrapper?.setStateResolve) {
                        wrapper.setStateResolve();
                        wrapper.setStateResolve = undefined;
                    }
                    return;
                }
                
            });
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
                    [CORE_ACTION_KEY]: CORE_STOP,
                });
            });
        },

        moduleEmit(name, data, worker) {
            if (core.paused) {
                return;
            }
            core.moduleEmitDirect(name, data, worker);
        },

        moduleEmitDirect(name, data, owner) {
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
                if (worker !== owner) {
                    worker.postMessage({
                        [CORE_ACTION_KEY]: CORE_EVENT,
                        name,
                        data,
                    });
                }
            });
        },
    });
};
