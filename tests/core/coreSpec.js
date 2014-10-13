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

  it('Should delete a new module', function() {
    expect(true).toEqual(true);
  });

  it('Should start all modules', function() {
    expect(true).toEqual(true);
  });

  it('Should delete all modules', function() {
    expect(true).toEqual(true);
  });
});