export { Core, ALL, ERROR };
export { startEventRecorder, stopEventRecorder } from "./eventRecorder.js";
export { replayEvents } from "./eventPlayer.js";
export { useDefaultLogging } from "./logging.js";
import EventEmitter from "event-e3";


const ALL = Symbol();
const ERROR = Symbol();

const Core = class {
    constructor() {
        this.paused = false;
        this.moduleInstances = new Map();
        this.boundModuleEmit = this.moduleEmit.bind(this);
        EventEmitter(this);
    }

    getState(name) {
        if (!this.moduleInstances.has(name)) {
            return Promise.reject(`module with name ${name} does not exist`);
        }

        const wrapper = this.moduleInstances.get(name);
        if (!wrapper.module.getState) {
            return Promise.resolve({});
        }
        return Promise.resolve().then(() => {
            return wrapper.module.getState(wrapper.instance);
        });
    }

    /* returns a promise with an object 
        as keys the names of the module instances
        as value the state received */
    getAllStates() {
        const promises = [];
        const names = []; // freeze names in case something is added ore removed while the promise is being resolved 
        this.moduleInstances.forEach((wrapper, name) => {
            promises.push(this.getState(name));
            names.push(name);
        });

        return Promise.all(promises).then((results) => {
            // Promise.all preserves order
            const resultsAsObject = {};
            results.forEach((result, i) => {
                resultsAsObject[names[i]] = result;
            });
            return resultsAsObject;
        });
    }

    restoreState (name, state) {
        if (!this.moduleInstances.has(name)) {
            return Promise.reject(`module with name ${name} does not exist`);
        }

        const wrapper = this.moduleInstances.get(name);
        if (!wrapper.module.restoreState) {
            return Promise.resolve();
        }
        return Promise.resolve().then(() => {
            return wrapper.module.restoreState(wrapper.instance, state);
        });

    }

    restoreAllStates(states) {
        return Promise.all(Object.entries(states).map(([name, state]) => {
            return this.restoreState(name, state);
        }));
    }

    start(module, { name = Symbol() } = {}) {
        if (this.moduleInstances.has(name)) {
            return Promise.reject(`module with name ${name} already started`);
        }

        if (!module.start) {
            return Promise.reject(`module must have start defined`);
        }

        const emitter = new EventEmitter();

        emitter.emit = this.boundModuleEmit;

        return Promise.resolve().then(() => {
            return module.start(emitter);
        }).then(instance => {
            this.moduleInstances.set(name, {
                module,
                instance,
                name,
                emitter,
            });
        }).then(() => {
            return name;
        }).catch(errorModuleStart => {
            this.emit(ERROR, {
                time: Date.now(),
                phase: `module.start`,
                error: errorModuleStart,
            });
        });
    }

    stop(name) {
        const wrapper = this.moduleInstances.get(name);

        if (!wrapper) {
            return Promise.resolve(false);
        }

        wrapper.emitter.off();

        return Promise.resolve().then(() => {
            this.moduleInstances.delete(name);
            if (wrapper.module.stop) {
                wrapper.module.stop(wrapper.instance);
            }
        }).catch(errorModuleStop => {
            this.emit(ERROR, {
                time: Date.now(),
                phase: `module.stop`,
                error: errorModuleStop,
            });
        }).then(() => {
            return true;
        });
    }

    moduleEmit(name, data) {
        if (this.paused) {
            return;
        }
        this.moduleEmitDirect(name, data);
    }

    moduleEmitDirect(name, data) {
        this.emit(name, data);
        this.emit(ALL, { name, data, time: Date.now() });
        this.moduleInstances.forEach(({ emitter }) => {
            try {
                EventEmitter.prototype.emit.call(emitter, name, data);
            } catch (error) {
                this.emit(ERROR, {
                    time: Date.now(),
                    phase: `module runtime (emitter.on)`,
                    error,
                });
            }
        });
    }
};
