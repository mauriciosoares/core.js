describe('Testing Core', function() {
  afterEach(function() {
    Core.stopAll();
    Core.modules = {};
  });

  it('Should create a new module', function() {
    Core.register('tweet', function() {});

    expect(Core.modules['tweet']).not.toBeUndefined();
  });

  it('Should return false and throw a log if the module is already registered', function() {
    spyOn(Core.helpers, 'err');
    Core.register('tweet', function() {});

    expect(Core.register('tweet', function() {})).toBeFalsy();
    expect(Core.helpers.err).toHaveBeenCalled();
  });

  it('Should start a new module', function() {
    Core.register('tweet', function() {});
    Core.start('tweet');

    expect(Core.modules.tweet.instance).not.toBeNull();
  });

  it('Should return false and throw a log if the module is already started', function() {
    spyOn(Core.helpers, 'err');
    Core.register('tweet', function() {});
    Core.start('tweet');

    expect(Core.start('tweet')).toBeFalsy();
    expect(Core.helpers.err).toHaveBeenCalled();
  });

  it('Should stop a new module', function() {
    Core.register('tweet', function() {});
    Core.start('tweet');
    Core.stop('tweet');

    expect(Core.modules.tweet.instance).toBeNull();
  });

  it('Should return false and throw a log if the module is already stopped', function() {
    spyOn(Core.helpers, 'err');
    Core.register('tweet', function() {});
    Core.start('tweet');
    Core.stop('tweet');

    expect(Core.stop('tweet')).toBeFalsy();
    expect(Core.helpers.err).toHaveBeenCalled();
  });

  it('Should start all modules', function() {
    Core.register('tweet1', function() {});
    Core.register('tweet2', function() {});
    Core.register('tweet3', function() {});

    Core.startAll();

    expect(Core.modules.tweet1.instance).not.toBeNull();
    expect(Core.modules.tweet2.instance).not.toBeNull();
    expect(Core.modules.tweet3.instance).not.toBeNull();
  });

  it('Should stop all modules', function() {
    Core.register('tweet1', function() {});
    Core.register('tweet2', function() {});
    Core.register('tweet3', function() {});

    Core.startAll();
    Core.stopAll();

    expect(Core.modules.tweet1.instance).toBeNull();
    expect(Core.modules.tweet2.instance).toBeNull();
    expect(Core.modules.tweet3.instance).toBeNull();
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

  it('Should trigger destroy from the modules that where stoped', function() {
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

  it('Should extend and return a different component from Core extensions', function() {
    var jQuery = {};
    Core.extend('$', jQuery);

    expect(Core.getExtension('$')).toBe(jQuery);
  });

  it('Should return null if the extension doesn\'t exists into Core extensions', function() {
    expect(Core.getExtension('foo')).toBeNull();
  });

  describe('Testing Isolation of DOM', function() {
    it('Should return the DOM element if it has the same id as the module', function() {
      var newElement = document.createElement('div');
      newElement.id = 'tweet';
      document.body.appendChild(newElement);

      Core.register('tweet', function() {
        return {
          init: function() {
            expect(this.el).toBe(newElement);
          }
        };
      });

      Core.start('tweet');
    });

    it('Should return null if the module doesnt find any DOM element with the same name', function() {
      Core.register('tweet2', function() {
        return {
          init: function() {
            expect(this.el).toBeNull();
          }
        };
      });

      Core.start('tweet2');
    });
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
  });
});
