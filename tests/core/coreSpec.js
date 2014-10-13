describe('Testing Core', function() {
  beforeEach(function() {
    Core.stopAll();
  });
  it('Should create a new module', function() {
    Core.register('tweet', function() {});

    expect(Core.modules['tweet']).not.toBeUndefined();
  });

  it('Should should trigger a callback when the init method is declared', function() {

  });
});