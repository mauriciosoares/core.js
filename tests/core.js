var { Core, ALL } = require('../dist/core.umd.js')

const createModuleMock = () => {
    const module = {
        started: 0,
        stopped: 0,
    };
    Object.assign(module, {
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

    it('Should return false and throw a log if the module is already stopped', function () {
        //spyOn(err);
        core.register('tweet', function () { });
        core.start('tweet');
        core.stop('tweet');

        expect(core.stop('tweet')).toBeFalsy();
        //expect(err).toHaveBeenCalled();
    });


    it('Should start non singleton modules with an alias', function () {
        core.register('user', function () {
            return {
                "init": function () { }
            }
        }, true);
        core.start('user', 'Moritz');
        core.stop('Moritz');

        expect(core.stop('Moritz')).toBeFalsy();
    });

    it('Should not return false and when a factory is already used with different alias', function () {
        core.register('user', function () {
            return {
                "init": function () {
                    return true;
                }
            }
        }, true);
        core.start('user', 'Moritz');


        expect(core.start('user', 'Max')).toBeTruthy();
        core.stop('Moritz');
        core.stop('Max');
        //expect(err).toHaveBeenCalled();
    });

    xit('Should start all modules', function () {
        core.register('tweet1', function () { });
        core.register('tweet2', function () { });

        core.startAll();

        expect(core.moduleInstances.tweet1).not.toBeNull();
        expect(core.moduleInstances.tweet2).not.toBeNull();
    });

    it('Should start all modules using the method start if no parameter is passed', function () {
        core.register('tweet1', function () { });
        core.register('tweet2', function () { });

        core.start();

        expect(core.moduleInstances.tweet1).not.toBeNull();
        expect(core.moduleInstances.tweet2).not.toBeNull();
    });

    xit('Should stop all modules', function () {
        core.register('tweet1', function () { });
        core.register('tweet2', function () { });

        core.startAll();
        core.stopAll();

        expect(core.moduleInstances.tweet1).toBeUndefined();
        expect(core.moduleInstances.tweet2).toBeUndefined();
    });

    it('Should stop all modules using the method stop if no parameter is passed', function () {
        core.register('tweet1', function () { });
        core.register('tweet2', function () { });

        core.start();
        core.stop();

        expect(core.moduleInstances.tweet1).toBeUndefined();
        expect(core.moduleInstances.tweet2).toBeUndefined();
    });

    it('Should trigger init when the module is started', function () {
        var spying = {
            tweet: function () { }
        };

        spyOn(spying, 'tweet');
        core.register('tweet', function () {
            return {
                init: function () {
                    spying.tweet();
                }
            };
        });

        core.start('tweet');

        expect(spying.tweet).toHaveBeenCalled();
    });

    it('Should trigger init from the modules that where started', function () {
        var spying = {
            tweet1: function () { },
            tweet2: function () { },
            tweet3: function () { }
        };

        spyOn(spying, 'tweet1');
        spyOn(spying, 'tweet2');
        spyOn(spying, 'tweet3');

        core.register('tweet1', function () {
            return {
                init: function () {
                    spying.tweet1();
                }
            };
        });

        core.register('tweet2', function () {
            return {
                init: function () {
                    spying.tweet2();
                }
            };
        });

        core.register('tweet3', function () {
            return {
                init: function () {
                    spying.tweet3();
                }
            };
        });

        core.start('tweet1');
        core.start('tweet3');

        expect(spying.tweet1).toHaveBeenCalled();
        expect(spying.tweet2).not.toHaveBeenCalled();
        expect(spying.tweet3).toHaveBeenCalled();
    });

    it('Should trigger destroy when module is stoped', function () {
        var spying = {
            tweet: function () { }
        };

        spyOn(spying, 'tweet');
        core.register('tweet', function () {
            return {
                destroy: function () {
                    spying.tweet();
                }
            };
        });

        core.start('tweet');
        core.stop('tweet');

        expect(spying.tweet).toHaveBeenCalled();
    });

    it('Should trigger destroy from the modules that where stopped', function () {
        var spying = {
            tweet1: function () { },
            tweet2: function () { },
            tweet3: function () { }
        };

        spyOn(spying, 'tweet1');
        spyOn(spying, 'tweet2');
        spyOn(spying, 'tweet3');

        core.register('tweet1', function () {
            return {
                destroy: function () {
                    spying.tweet1();
                }
            };
        });

        core.register('tweet2', function () {
            return {
                destroy: function () {
                    spying.tweet2();
                }
            };
        });

        core.register('tweet3', function () {
            return {
                destroy: function () {
                    spying.tweet3();
                }
            };
        });

        core.start('tweet1');
        core.start('tweet2');
        core.start('tweet3');

        core.stop('tweet1');
        core.stop('tweet3');

        expect(spying.tweet1).toHaveBeenCalled();
        expect(spying.tweet2).not.toHaveBeenCalled();
        expect(spying.tweet3).toHaveBeenCalled();
    });

    describe('Testing return in Start and Stop methods', function () {
        it('Should return in the Start method the value returned from the init method inside the module', function () {
            core.register('tweet', function () {
                return {
                    init: function () {
                        return true;
                    }
                }
            });

            expect(core.start('tweet')).toBeTruthy();

        });

        it('Should return in the Stop method the value returned from the destroy method inside the module', function () {
            core.register('tweet', function () {
                return {
                    destroy: function () {
                        return true;
                    }
                }
            });

            core.start('tweet')
            expect(core.stop('tweet')).toBeTruthy();

        });
    });
});
