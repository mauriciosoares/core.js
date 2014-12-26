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
          sandbox.listen('new-tweet', this.newTweet)
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
          sandbox.listen(['new-tweet', 'new-tweet2'], this.newTweet)
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

  it('Should notify other modules from a specific notification');

  it('Should pass data through notifications');

  it('Should give access to a extension inside a module');

  it('Should not overwrite an existing listening notification');

  it('Should overwrite an existing notification if force parameter is passed');
});
