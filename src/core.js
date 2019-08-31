export { Core, ALL };
import EventEmitter from "../node_modules/event-e3/event-e3.js";


const ALL = Symbol();

const Core = class {
    constructor() {
        this.moduleInstances = new Map();
        EventEmitter(this);
    }

    register() {

    }

    start(module, { name = Symbol() } = {}) {
        if (this.moduleInstances.has(name)) {
            throw `module with name ${name} already started`;
        }

        const emitter = new EventEmitter();

        // emulate emitter.on(ANY, (name, data) => {
        emitter.emit = (name, data) => {
            this.emit(name, data);
            this.emit(ALL, { name, data, time: Date.now() });
            this.moduleInstances.forEach(({ emitter }) => {
                EventEmitter.prototype.emit.call(emitter, name, data);
            });
        };

        this.moduleInstances.set(name, {
            module,
            instance: module.start(emitter),
            name,
            emitter,
        });

        return name;
    }

    stop(name) {
        const wrapper = this.moduleInstances.get(name);

        if (!wrapper) {
            //err('!stop', module);
            return false;
        }

        wrapper.emitter.off();
        if (wrapper.module.stop) {
            wrapper.module.stop(wrapper.instance);
        }

        this.moduleInstances.delete(name);

        return true;
    }
};
