'use strict';

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
* @param {array} dependencies modules or extensions this module depends on
*/
Core.prototype.register = function(module, constructor, dependencies) {
  if(this.modules[module]) {
    this.helpers.err('!!module', {
      module: module
    });
    return false;
  }
  this.modules[module] = {
    constructor: constructor,
    dependencies: dependencies || [],
    instance: null
  };
};

/**
* Check if the module is already initialized or not
*
* @method moduleCheck
* @param {Object} module the module that will be checked
* @param {boolean} destroy check if the module exists, but is already destroyed
* @return {boolean} if the module exists or already have an instance
*/
Core.prototype.moduleCheck = function(module, destroy) {
  if(destroy) return !module || !module.instance;

  return !module || module.instance;
};

/**
* Checks whether the required module dependencies exist
*
* @method nextDependency
* @param {Object} module the module whose dependencies will be checked
* @return {string|null} the name of the next unmatched dependency or null if all
* dependencies are satisfied
*/
Core.prototype.nextDependency = function(module) {
  if(module.dependencies.length === 0) {
    return null;
  }

  // Check modules
  var modules = module.dependencies.modules || [];
  for(var i = 0; i < modules.length; i++) {
    if(!this.modules[modules[i]]) {
      return modules[i];
    }
  }

  // Check extensions
  var extensions = module.dependencies.extensions || [];
  for(i = 0; i < extensions.length; i++) {
    if(!this.getExtension(extensions[i])) {
      return extensions[i];
    }
  }

  return null;
};

/**
* Gets an element by ID to attach to the module instance
*
* @method getElement
* @param {string} id the id of the main element in the module
*/
Core.prototype.getElement = function(id) {
  var el = document.getElementById(id);

  // this fixes some blackberry, opera and IE possible bugs
  return (el && el.id === id && el.parentElement) ? el : null;
};

/**
* Starts a registered module, if no module is passed, it starts all modules
*
* @method start
* @param {string} module the name of the module
*/
Core.prototype.start = function(module) {
  if(!module) return this.startAll();

  var cModule = this.modules[module],
    el = this.getElement(module);

  if(this.moduleCheck(cModule)) {
    this.helpers.err('!start', {
      module: module
    });
    return false;
  }

  var dependency = this.nextDependency(cModule);
  if(dependency) {
    this.helpers.err('!deps', {
      module: module,
      dependency: dependency
    });
    return false;
  }

  cModule.instance = new cModule.constructor(new this.Sandbox(module));

  // attachs the element to the instance of the module
  cModule.instance.el = el;

  if(cModule.instance.init) return cModule.instance.init();
};

/**
* Stops a registered module
*
* @method start
* @param {string} module the name of the module
*/
Core.prototype.stop = function(module) {
  if(!module) return this.stopAll();

  var cModule = this.modules[module], stopReturn;

  if(this.moduleCheck(cModule, true)) {
    this.helpers.err('!stop', {
      module: module
    });
    return false;
  }

  if(cModule.instance.destroy) stopReturn = cModule.instance.destroy();

  cModule.instance = null;

  this.Sandbox.clearNotifications(module);

  return stopReturn;
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
* Stop all started modules
*
* @method stopAll
*/
Core.prototype.startAll = function() {
  this.xAll('start');
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

Core = new Core();
