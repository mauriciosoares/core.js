(function(root) {
  var Core = function() {
    this.modules = {};
  };

  Core.prototype.register = function(module, constructor) {
    this.modules[module] = {
      constructor: constructor,
      instance: null
    };
  };

  Core.prototype.start = function(module) {
    var module = this.modules[module];

    module.instance = new module.constructor(new Sandbox());
    module.instance.init && module.instance.init();
  };

  Core.prototype.startAll = function() {
    for(var module in this.modules) {
      if(this.modules.hasOwnProperty(module) && !this.modules[module].instance) {
        this.start(module);
      }
    }
  };

  Core.prototype.stop = function(module) {
    var module = this.modules[module];

    module.instance.destroy && module.instance.destroy();
    module.instance = null;
  };

  Core.prototype.stopAll = function() {
    for(var module in this.modules) {
      if(this.modules.hasOwnProperty(module)) {
        this.stop(module);
      }
    }
  };

  root.Core = new Core();
} (window));
