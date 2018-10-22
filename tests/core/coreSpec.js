var {CoreClass} = require('../../dist/core.umd.js')

let Core;
describe('Testing Core', function() {
    
  beforeEach(function () {
      Core = new CoreClass();
  });
  
  afterEach(function() {
    Core.stopAll();
    Core.modules = {};
  });

  it('Should create a new module', function() {
    Core.register('tweet', function() {});

    expect(Core.modules['tweet']).not.toBeUndefined();
  });

  it('Should return false and throw a log if the module is already registered', function() {
    //spyOn(err);
    Core.register('tweet', function() {});

    expect(Core.register('tweet', function() {})).toBeFalsy();
    //expect(err).toHaveBeenCalled();
  });

  it('Should start a new module', function() {
    Core.register('tweet', function() {});
    Core.start('tweet');

    expect(Core.modulesInstances.tweet).not.toBeUndefined();
    });

  it('Should return false and throw a log if the module is already started', function() {
    //spyOn(err);
    Core.register('tweet', function() {});
    Core.start('tweet');

    expect(Core.start('tweet')).toBeFalsy();
    //expect(err).toHaveBeenCalled();
  });

  it('Should stop a new module', function() {
    Core.register('tweet', function() {});
    Core.start('tweet');
    Core.stop('tweet');

    expect(Core.modulesInstances.tweet).toBeUndefined();
  });

  it('Should return false and throw a log if the module is already stopped', function() {
    //spyOn(err);
    Core.register('tweet', function() {});
    Core.start('tweet');
    Core.stop('tweet');

    expect(Core.stop('tweet')).toBeFalsy();
    //expect(err).toHaveBeenCalled();
  });

  
  it('Should start non singleton modules with an alias', function() {
    Core.register('user', function () {
        return {
        "init": function() {},
        "factory": true
    }});
    Core.start('user', 'Moritz');
    Core.stop('Moritz');

    expect(Core.stop('Moritz')).toBeFalsy();
  });

   it('Should not return false and when a factory is already used with different alias', function() {
    Core.register('user', function () {
        return {
        "init": function() {},
        "factory": true
    }});
    Core.start('user', 'Moritz');
    
    
    expect(Core.start('user', 'Max')).toBeTruethy();
    Core.stop('Moritz');
    Core.stop('Max');
    //expect(err).toHaveBeenCalled();
  });

  it('Should start all modules', function() {
    Core.register('tweet1', function() {});
    Core.register('tweet2', function() {});
  
    Core.startAll();

    expect(Core.modulesInstances.tweet1).not.toBeNull();
    expect(Core.modulesInstances.tweet2).not.toBeNull();
  });

  it('Should start all modules using the method start if no parameter is passed', function() {
    Core.register('tweet1', function() {});
    Core.register('tweet2', function() {});
  
    Core.start();

    expect(Core.modulesInstances.tweet1).not.toBeNull();
    expect(Core.modulesInstances.tweet2).not.toBeNull();
  });

  it('Should stop all modules', function() {
    Core.register('tweet1', function() {});
    Core.register('tweet2', function() {});
  
    Core.startAll();
    Core.stopAll();
  
    expect(Core.modulesInstances.tweet1).toBeUndefined();
    expect(Core.modulesInstances.tweet2).toBeUndefined();
  });

  it('Should stop all modules using the method stop if no parameter is passed', function() {
    Core.register('tweet1', function() {});
    Core.register('tweet2', function() {});
    
    Core.start();
    Core.stop();

    expect(Core.modulesInstances.tweet1).toBeUndefined();
    expect(Core.modulesInstances.tweet2).toBeUndefined();
  });

  it('Should trigger init when the module is started', function() {
    var spying = {
      tweet: function() {}
    };

    spyOn(spying, 'tweet');
    Core.register('tweet', function() {
      return {
        init: function() {
          spying.tweet();
        }
      };
    });

    Core.start('tweet');

    expect(spying.tweet).toHaveBeenCalled();
  });

  it('Should trigger init from the modules that where started', function() {
    var spying = {
      tweet1: function() {},
      tweet2: function() {},
      tweet3: function() {}
    };

    spyOn(spying, 'tweet1');
    spyOn(spying, 'tweet2');
    spyOn(spying, 'tweet3');

    Core.register('tweet1', function() {
      return {
        init: function() {
          spying.tweet1();
        }
      };
    });

    Core.register('tweet2', function() {
      return {
        init: function() {
          spying.tweet2();
        }
      };
    });

    Core.register('tweet3', function() {
      return {
        init: function() {
          spying.tweet3();
        }
      };
    });

    Core.start('tweet1');
    Core.start('tweet3');

    expect(spying.tweet1).toHaveBeenCalled();
    expect(spying.tweet2).not.toHaveBeenCalled();
    expect(spying.tweet3).toHaveBeenCalled();
  });

  it('Should trigger destroy when module is stoped', function() {
    var spying = {
      tweet: function() {}
    };

    spyOn(spying, 'tweet');
    Core.register('tweet', function() {
      return {
        destroy: function() {
          spying.tweet();
        }
      };
    });

    Core.start('tweet');
    Core.stop('tweet');

    expect(spying.tweet).toHaveBeenCalled();
  });

  it('Should trigger destroy from the modules that where stopped', function() {
    var spying = {
      tweet1: function() {},
      tweet2: function() {},
      tweet3: function() {}
    };

    spyOn(spying, 'tweet1');
    spyOn(spying, 'tweet2');
    spyOn(spying, 'tweet3');

    Core.register('tweet1', function() {
      return {
        destroy: function() {
          spying.tweet1();
        }
      };
    });

    Core.register('tweet2', function() {
      return {
        destroy: function() {
          spying.tweet2();
        }
      };
    });

    Core.register('tweet3', function() {
      return {
        destroy: function() {
          spying.tweet3();
        }
      };
    });

    Core.start('tweet1');
    Core.start('tweet2');
    Core.start('tweet3');

    Core.stop('tweet1');
    Core.stop('tweet3');

    expect(spying.tweet1).toHaveBeenCalled();
    expect(spying.tweet2).not.toHaveBeenCalled();
    expect(spying.tweet3).toHaveBeenCalled();
  });

  describe('Testing return in Start and Stop methods', function() {
    it('Should return in the Start method the value returned from the init method inside the module', function() {
      Core.register('tweet', function() {
        return {
          init: function() {
            return true;
          }
        }
      });

      expect(Core.start('tweet')).toBeTruthy();

    });

    it('Should return in the Stop method the value returned from the destroy method inside the module', function() {
      Core.register('tweet', function() {
        return {
          destroy: function() {
            return true;
          }
        }
      });

      Core.start('tweet')
      expect(Core.stop('tweet')).toBeTruthy();

    });
  });
});
