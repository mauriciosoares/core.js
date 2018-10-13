export {Core, CoreClass};
import {err} from "../helpers/err.js";
import {Sandbox} from "../sandbox/sandbox.js";

/**
* The constructor of Core
*
* @class CoreClass
* @constructor
*/
var CoreClass = function() {
  this.modules = {};
};

/**
* Registers a new module
*
* @method register
* @param {string} module the name of the new module
* @param {function} constructor the constructor of the new module
*/
CoreClass.prototype.register = function(module, constructor) {
  if(this.modules[module]) {
    err('!!module', module);
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
CoreClass.prototype.moduleCheck = function(module, destroy) {
  if (destroy) return !module || !module.instance;

  return !module || module.instance;
};

/**
* Starts a registered module, if no module is passed, it starts all modules
*
* @method start
* @param {string} module the name of the module
*/
CoreClass.prototype.start = function(module) {
  if(!module) return this.startAll();

  var cModule = this.modules[module];

  if(this.moduleCheck(cModule)) {
    err('!start', module);
    return false;
  }

  cModule.instance = new cModule.constructor(new Sandbox(module));


  if(cModule.instance.init) return cModule.instance.init();
};

/**
* Stops a registered module
*
* @method start
* @param {string} module the name of the module
*/
CoreClass.prototype.stop = function(module) {
  if(!module) return this.stopAll();

  var cModule = this.modules[module], stopReturn;

  if(this.moduleCheck(cModule, true)) {
    //err('!stop', module);
    return false;
  }

  if(cModule.instance.destroy) stopReturn = cModule.instance.destroy();

  cModule.instance = null;

  Sandbox.clearNotifications(module);

  return stopReturn;
};

/**
* Stop all started modules
*
* @method stopAll
*/
CoreClass.prototype.stopAll = function() {
  this.xAll('stop');
};

/**
* Stop all started modules
*
* @method stopAll
*/
CoreClass.prototype.startAll = function() {
  this.xAll('start');
};

/**
* Helper for startAll and stopAll
*
* @method xAll
* @param {string} method the method that will be triggered
*/
CoreClass.prototype.xAll = function(method) {
  for(var module in this.modules) {
    if(this.modules.hasOwnProperty(module)) this[method](module);
  }
};

var Core = new CoreClass();
