var { Core, ALL } = require('../dist/core.umd.js')

const createModuleMock = () => {
    const module = {
        started: 0,
        stopped: 0,
    };
    return Object.assign(module, {
        start() {
            module.started += 1;
        },
        stop() {
            module.stopped += 1;
        },
    });
};

let core;
describe('Testing Core', function () {

    beforeEach(function () {
        core = new Core();
    });

    afterEach(function () {
    });

    it('should call start of that module', function () {
        const module = createModuleMock();
        core.start(module);

        expect(module.started).toBe(1);
    });

    it('should fail if start is undefined', function () {
        const module = createModuleMock();
        delete module[`start`];
        core.start(module);

        expect(module.started).toBe(0);
    });

    it('should call stop of that module', function () {
        const module = createModuleMock();
        const id = core.start(module);
        core.stop(id);

        expect(module.stopped).toBe(1);
    });

    it('should not fail if stop is undefined', function () {
        const module = createModuleMock();
        delete module[`stop`];
        const id = core.start(module);
        core.stop(id);

        expect(module.started).toBe(1);
    });

    it('should use the name as id if it was provided', function () {
        const name = `myName`;
        const module = createModuleMock();
        const id = core.start(module, { name });

        expect(id).toBe(name);
    });

    it('should allow multiple instances start', function () {
        const module = createModuleMock();
        core.start(module);
        core.start(module);

        expect(module.started).toBe(2);
    });

    it('start multiple instances with the same name should throw', function () {
        const name = `myName`;
        const module = createModuleMock();
        core.start(module, { name });

        expect(function () {
            core.start(module, { name });
        }).toThrow();
    });

    it('should silently proceed if stop is called on something already stopped', function () {
        const module = createModuleMock();
        const id = core.start(module);
        core.stop(id);
        core.stop(id);

        expect(module.stopped).toBe(1);
    });


    it('stop should receive as first argument the return of the start', function () {
        const x = Symbol()
        const module = {
            start() {
                return x;
            },
            stop(arg1) {
                expect(arg1).toBe(x);
            },
        };
        const id = core.start(module);
        core.stop(id);
    });

    it('start should receive an emitter to be able to communcicate with other modules', function () {
        const module = {
            start(emitter) {
                expect(emitter.on).toBeDefined();
                expect(emitter.off).toBeDefined();
                expect(emitter.emit).toBeDefined();
            },
        };
        core.start(module);
    });
});
