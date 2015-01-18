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
  if(this.modules[module]) {
    this.helpers.err('!!module', module);
    return false;
  }
  this.modules[module] = {
    constructor: constructor,
    instance: null
  };
};

/**
* Check if the module is already initialized or not
*
* @method moduleCheck
* @param {string} module the name of the module that will be checked
* @param {boolean} destroy check if the module exists, but is already destroyed
* @return {boolean} if the module exists or already have an instance
*/
Core.prototype.moduleCheck = function(module, destroy) {
  if(destroy) return !module || !module.instance;

  return !module || module.instance;
};

/**
* Gets an element by ID to attach to the module instance
*
* @method getElement
* @param {string} id the id of the main element in the module
*/
Core.prototype.getElement = function(id) {
  return document.getElementById(id);
};

/**
* Starts a registered module
*
* @method start
* @param {string} module the name of the module
*/
Core.prototype.start = function(module) {
  var cModule = this.modules[module],
    el = this.getElement(module);

  if(this.moduleCheck(cModule)) {
    this.helpers.err('!start', module);
    return false;
  }

  cModule.instance = new cModule.constructor(new this.Sandbox(module));

  // attachs the element to the instance of the module
  cModule.instance.el = el;

  if(cModule.instance.init) return Promise.resolve(cModule.instance.init());
};

/**
* Stops a registered module
*
* @method start
* @param {string} module the name of the module
*/
Core.prototype.stop = function(module) {
  var cModule = this.modules[module], stopReturn;

  if(this.moduleCheck(cModule, true)) {
    this.helpers.err('!stop', module);
    return false;
  }

  if(cModule.instance.destroy) stopReturn = cModule.instance.destroy();

  cModule.instance = null;

  this.Sandbox.clearNotifications(module);

  return Promise.resolve(stopReturn);
};

/**
* Start all uninstarted modules
*
* @method startAll
*/
Core.prototype.startAll = function() {
  return this.xAll('start');
};

/**
* Stop all started modules
*
* @method stopAll
*/
Core.prototype.stopAll = function() {
  return this.xAll('stop');
};

/**
* Helper for startAll and stopAll
* 
* @method xAll
* @param {string} method the method that will be triggered
* @return A promise that will be resolved when all modules have executed   
*/
Core.prototype.xAll = function(method) {
  var resultMap = {};
  
  var moduleResults = Object.keys(this.modules).map(function(module) {
    return this[method](module).then(function(result) {
      resultMap[module] = result;
    });
  }.bind(this));
  
  return Promise.all(moduleResults).then(function() {
    return resultMap;
  });
};

Core = new Core();
