describe('Testing Core', function() {
  afterEach(function() {
    Core.stopAll();
  });
  it('Should create a new module', function() {
    Core.register('tweet', function() {});

    expect(Core.modules['tweet']).not.toBeUndefined();
  });

  it('Should start a new module');

  it('Should stop a new module');

  it('Should start all modules');

  it('Should stop all modules');

  it('Should throw an error when a module is not defined');

  it('Should trigger init when the module is started');

  it('Should trigger destroy when module is stoped');

  it('Should extend a different component into Core extensions');

  it('Should return the registered extension');
});
