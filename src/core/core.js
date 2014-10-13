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
    var cModule = this.modules[module];

    if(cModule.instance) {
      return;
    }
    // debugger;
    cModule.instance = new cModule.constructor(new Sandbox());

    if(cModule.instance.init) {
      cModule.instance.init();
    }
  };

  Core.prototype.stop = function(module) {
    var cModule = this.modules[module];

    if(!cModule.instance) {
      return;
    }

    if(cModule.instance.destroy) {
      cModule.instance.destroy();
    }
    cModule.instance = null;

    delete this.modules[module];
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
