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

  it('Should listen to notification from other modules');

  it('Should notify other modules from a specific notification');

  it('Should pass data through notifications');

  it('Should give access to a extension inside a module');

  it('Should not overwrite an existing listening notification');

  it('Should overwrite an existing notification if force parameter is passed');

  it('Should listen to multiple notification if its used as array');
});
