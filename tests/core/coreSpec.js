describe('Testing Core', function() {
  afterEach(function() {
    Core.stopAll();
    Core.modules = {};
  });
  it('Should create a new module', function() {
    Core.register('tweet', function() {});

    expect(Core.modules['tweet']).not.toBeUndefined();
  });

  it('Should start a new module', function() {
    Core.register('tweet', function() {});
    Core.start('tweet');

    expect(Core.modules.tweet.instance).not.toBeNull();
  });

  it('Should stop a new module', function() {
    Core.register('tweet', function() {});
    Core.start('tweet');
    Core.stop('tweet');

    expect(Core.modules.tweet.instance).toBeNull();
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

  it('Should throw an error when a module is not defined');

  it('Should trigger init when the module is started');

  it('Should trigger init from the modules that where started');

  it('Should trigger destroy when module is stoped');

  it('Should trigger destroy from the modules that where stoped');

  it('Should extend a different component into Core extensions');

  it('Should return the registered extension');
});
