(function(root) {
  /**
  * The constructor of Core
  *
  * @class Core
  * @constructor
  */
  var Core = function() {
    this.modules = {};
  };

  /**
  * Registers a new module
  *
  * @method register
  * @param {string} module the name of the new module
  * @param {function} constructor the constructor of the new module
  */
  Core.prototype.register = function(module, constructor) {
    this.modules[module] = {
      constructor: constructor,
      instance: null
    };
  };

  /**
  * Check if the module already exists
  *
  * @method moduleExist
  * @param {string} module the name of the module that will be checked
  * @param {boolean} destroy check if the module exists, but is already destroyed
  * @return {boolean} if the module exists or already have an instance
  */
  Core.prototype.moduleExist = function(module, destroy) {
    if(destroy) return !module || !module.instance;

    return !module || module.instance;
  };

  /**
  * Starts a registered module
  *
  * @method start
  * @param {string} module the name of the module
  */
  Core.prototype.start = function(module) {
    var cModule = this.modules[module];

    if(this.moduleExist(cModule)) return;

    cModule.instance = new cModule.constructor(new root.Sandbox(module));

    if(cModule.instance.init) cModule.instance.init();
  };

  /**
  * Stops a registered module
  *
  * @method start
  * @param {string} module the name of the module
  */
  Core.prototype.stop = function(module) {
    var cModule = this.modules[module];

    if(this.moduleExist(cModule, true)) return;

    if(cModule.instance.destroy) cModule.instance.destroy();

    cModule.instance = null;

    root.Sandbox.clearNotifications(module);
  };

  /**
  * Start all uninstarted modules
  *
  * @method startAll
  */
  Core.prototype.startAll = function() {
    this.xAll('start');
  };

  /**
  * Stop all started modules
  *
  * @method stopAll
  */
  Core.prototype.stopAll = function() {
    this.xAll('stop');
  };

  /**
  * Helper for startAll and stopAll
  *
  * @method xAll
  * @param {string} method the method that will be triggered
  */
  Core.prototype.xAll = function(method) {
    for(var module in this.modules) {
      if(this.modules.hasOwnProperty(module)) this[method](module);
    }
  };

  root.Core = new Core();
} (this));
