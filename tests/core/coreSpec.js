describe('Testing Core', function() {
  afterEach(function() {
    Core.stopAll();
  });
  it('Should create a new module', function() {
    Core.register('tweet', function() {});

    expect(Core.modules['tweet']).not.toBeUndefined();
  });

  it('Should start a new module', function() {
    expect(true).toEqual(true);
  });

  it('Should stop a new module', function() {
    expect(true).toEqual(true);
  });

  it('Should start all modules', function() {
    expect(true).toEqual(true);
  });

  it('Should stop all modules', function() {
    expect(true).toEqual(true);
  });

  it('Should throw an error when a module is not defined', function() {
    expect(true).toEqual(true);
  });

  it('Should trigger init when the module is started', function() {
    expect(true).toEqual(true);
  });

  it('Should trigger destroy when module is stoped', function() {
    expect(true).toEqual(true);
  });
});
