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

  Core.prototype.moduleExist = function(module, destroy) {
    // this.helpers.Error('!module', module);
    if(destroy) return !module || !module.instance;

    return !module || module.instance;
  };

  Core.prototype.start = function(module) {
    var cModule = this.modules[module];

    if(this.moduleExist(cModule)) return;

    cModule.instance = new cModule.constructor(new root.Sandbox(module));

    if(cModule.instance.init) cModule.instance.init();
  };

  Core.prototype.stop = function(module) {
    var cModule = this.modules[module];

    if(this.moduleExist(cModule, true)) return;

    if(cModule.instance.destroy) cModule.instance.destroy();

    cModule.instance = null;

    root.Sandbox.clearNotifications(module);
  };

  Core.prototype.startAll = function() {
    this.xAll('start');
  };

  Core.prototype.stopAll = function() {
    this.xAll('stop');
  };

  Core.prototype.xAll = function(method) {
    for(var module in this.modules) {
      if(this.modules.hasOwnProperty(module)) {
        this[method](module);
      }
    }
  };

  root.Core = new Core();
} (this));
