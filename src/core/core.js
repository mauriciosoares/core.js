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
  var el = document.getElementById(id);

  // this fixes some blackberry, opera and IE possible bugs
  return (el && el.id === id && el.parentElement) ? el : null;
};

/**
* D.R.Y. solution to dealing with array-based start function for multiple
* modules at once
* 
* @method _start
* @param {string} module the name of the module
*/
Core.prototype._start = function (module) {
  var cModule = this.modules[module],
    el = this.getElement(module);

  if(this.moduleCheck(cModule)) {
    this.helpers.err('!start', module);
    return false;
  }

  cModule.instance = new cModule.constructor(new this.Sandbox(module));

  // attachs the element to the instance of the module
  cModule.instance.el = el;

  if(cModule.instance.init) return cModule.instance.init();
};

/**
* Starts a registered module, if no module is passed, it starts all modules
*
* @method start
* @param {string || array} module the name(s) of the module(s)
*/
Core.prototype.start = function(module) {
  if(!module) return this.startAll();
  
  // Determine if multiple modules are passed as an array
  var array = Core.helpers.isArray(module);
  
  if (array) { // Case for module being an array
    var modules = [],
        i;
    // Iterate over each of the 
    for (i = 0; i < module.length; i++) {
      modules.push(this._start(module[i]));
    }
    // Returns the init function of all modules passed
    return modules;
  } else { // Case for module being a string
    return this._start(module);
  }
};

/**
* D.R.Y. solution to dealing with array-based stop function for multiple
* modules at once
* 
* @method _stop
* @param {string} module the name of the module
*/
Core.prototype._stop = function(module) {
  var cModule = this.modules[module], stopReturn;

  if(this.moduleCheck(cModule, true)) {
    this.helpers.err('!stop', module);
    return false;
  }

  if(cModule.instance.destroy) stopReturn = cModule.instance.destroy();

  cModule.instance = null;

  this.Sandbox.clearNotifications(module);

  return stopReturn;
};

/**
* Stops a registered module
*
* @method stop
* @param {string || array} module the name(s) of the module(s)
*/
Core.prototype.stop = function(module) {
  if(!module) return this.stopAll();
  
  // Determine if multiple modules are passed as an array
  var array = Core.helpers.isArray(module);
  
  if (array) { // Case for module being an array
    var modules = [],
        i;
    // Iterate over each of the 
    for (i = 0; i < module.length; i++) {
      modules.push(this._stop(module[i]));
    }
    // Returns the init function of all modules passed
    return modules;
  } else { // Case for module being a string
    return this._stop(module);
  }
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
