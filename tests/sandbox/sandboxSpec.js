describe('Testing Sandbox', function() {
  afterEach(function() {
    Core.stopAll();
    Core.modules = {};
  });

  it('Should return an instance of sandbox as parameter inside modules', function() {
    Core.register('tweet', function(sandbox) {
      return {
        init: function() {
          expect(sandbox instanceof Sandbox).toBeTruthy();
        }
      }
    });

    Core.start('tweet');
  });

  it('Should listen to notification from other modules', function() {
    var spying = {
      newTweet: function() {}
    };

    spyOn(spying, 'newTweet');

    Core.register('tweet', function(sandbox) {
      return {
        init: function() {
          sandbox.notify({
            type: 'new-tweet',
            data: {}
          });
        }
      }
    });

    Core.register('tweet-list', function(sandbox) {
      return {
        init: function() {
          sandbox.listen('new-tweet', this.newTweet);
        },

        newTweet: function() {
          spying.newTweet();
        }
      }
    });

    Core.start('tweet-list');
    Core.start('tweet');

    expect(spying.newTweet).toHaveBeenCalled();
  });

  it('Should listen to multiple notifications using array as parameter', function() {
    var spying = {
      newTweet: function() {}
    };

    spyOn(spying, 'newTweet');

    Core.register('tweet', function(sandbox) {
      return {
        init: function() {
          sandbox.notify({
            type: 'new-tweet',
            data: {}
          });

          sandbox.notify({
            type: 'new-tweet2',
            data: {}
          });
        }
      }
    });

    Core.register('tweet-list', function(sandbox) {
      return {
        init: function() {
          sandbox.listen(['new-tweet', 'new-tweet2'], this.newTweet);
        },

        newTweet: function() {
          spying.newTweet();
        }
      }
    });

    Core.start('tweet-list');
    Core.start('tweet');

    expect(spying.newTweet.calls.count()).toEqual(2);
  });

  it('Should notify other modules from a specific notification', function() {
    var spying = {
      newTweet: function() {},
      newTweet2: function() {}
    };

    spyOn(spying, 'newTweet');
    spyOn(spying, 'newTweet2');

    Core.register('tweet', function(sandbox) {
      return {
        init: function() {
          sandbox.notify({
            type: 'new-tweet',
            data: {}
          });
        }
      }
    });

    Core.register('tweet-list', function(sandbox) {
      return {
        init: function() {
          sandbox.listen('new-tweet', this.newTweet);
          sandbox.listen('new-tweet2', this.newTweet2);
        },

        newTweet: function() {
          spying.newTweet();
        },

        newTweet2: function() {
          spying.newTweet2();
        }
      }
    });

    Core.start('tweet-list');
    Core.start('tweet');

    expect(spying.newTweet).toHaveBeenCalled();
    expect(spying.newTweet2).not.toHaveBeenCalled();
  });

  it('Should pass data through notifications', function() {
    Core.register('tweet', function(sandbox) {
      return {
        init: function() {
          sandbox.notify({
            type: 'new-tweet',
            data: {
              a: true,
              b: false
            }
          });
        }
      }
    });

    Core.register('tweet-list', function(sandbox) {
      return {
        init: function() {
          sandbox.listen('new-tweet', this.newTweet);
        },

        newTweet: function(data) {
          expect(data.a).toBeTruthy();
          expect(data.b).toBeFalsy();
        }
      }
    });

    Core.start('tweet-list');
    Core.start('tweet');
  });

  it('Should not overwrite an existing listening notification', function() {
    var spying = {
      toBeCalled: function() {},
      notToBeCalled: function() {}
    };

    spyOn(spying, 'toBeCalled');
    spyOn(spying, 'notToBeCalled');

    Core.register('tweet', function(sandbox) {
      return {
        init: function() {
          sandbox.notify({
            type: 'new-tweet',
            data: {}
          });
        }
      }
    });

    Core.register('tweet-list', function(sandbox) {
      return {
        init: function() {
          sandbox.listen('new-tweet', this.toBeCalled);
          sandbox.listen('new-tweet', this.notToBeCalled);
        },

        toBeCalled: function() {
          spying.toBeCalled();
        },

        notToBeCalled: function() {
          spying.notToBeCalled();
        }
      }
    });

    Core.start('tweet-list');
    Core.start('tweet');

    expect(spying.toBeCalled).toHaveBeenCalled();
    expect(spying.notToBeCalled).not.toHaveBeenCalled();
  });

  it('Should overwrite an existing notification if force parameter is passed', function() {
    var spying = {
      toBeCalled: function() {},
      toOverwrite: function() {}
    };

    spyOn(spying, 'toBeCalled');
    spyOn(spying, 'toOverwrite');

    Core.register('tweet', function(sandbox) {
      return {
        init: function() {
          sandbox.notify({
            type: 'new-tweet',
            data: {}
          });
        }
      }
    });

    Core.register('tweet-list', function(sandbox) {
      return {
        init: function() {
          sandbox.listen('new-tweet', this.toBeCalled);
          sandbox.listen('new-tweet', this.toOverwrite, this, true);
        },

        toBeCalled: function() {
          spying.toBeCalled();
        },

        toOverwrite: function() {
          spying.toOverwrite();
        }
      }
    });

    Core.start('tweet-list');
    Core.start('tweet');

    expect(spying.toBeCalled).not.toHaveBeenCalled();
    expect(spying.toOverwrite).toHaveBeenCalled();
  });

  it('Should be able to choose the "this" value inside an notification', function() {
    var thisReference = {};

    Core.register('tweet', function(sandbox) {
      return {
        init: function() {
          sandbox.notify({
            type: 'new-tweet',
            data: {}
          });
        }
      }
    });

    Core.register('tweet-list', function(sandbox) {
      return {
        init: function() {
          sandbox.listen('new-tweet', this.newTweet, thisReference);
        },

        newTweet: function() {
          expect(this).toBe(thisReference);
        }
      }
    });

    Core.start('tweet-list');
    Core.start('tweet');
  });

  it('Should give access to a extension inside a module', function() {
    var jQuery = {};
    Core.extend('$', jQuery);

    Core.register('tweet', function(sandbox) {
      return {
        init: function() {
          expect(sandbox.x('$')).toBe(jQuery);
        }
      }
    });

    Core.start('tweet');
  });
});
