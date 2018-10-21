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
CoreClass.prototype.register = function(module, constructor, factory = false) {
  if(this.modules[module]) {
    err('!!module', module);
    return false;
  }
  this.modules[module] = {
    constructor: constructor,
    instance: null,
    factory
  };
};

/**
* Starts a registered module, if no module is passed, it starts all modules
*
* @method start
* @param {string} moduleName
* @param {string|undefined} alias
*/
CoreClass.prototype.start = function(moduleName, alias = moduleName) {
  if (!moduleName) {
      return this.startAll();
  }

  var moduleWrapper = this.modules[moduleName];
  
  if (!moduleWrapper) {
    console.error(`Could not start ${moduleName}, it must be registered first`);
    return false;
  }

  if (!moduleWrapper.instance && !moduleWrapper.factory) {
    err('!start', moduleName);
    return false;
  }

  
  moduleWrapper.instance = new moduleWrapper.constructor(new Sandbox(alias));


  if(moduleWrapper.instance.init) {
      return moduleWrapper.instance.init();
  }
  return true;
};

/**
* Stops a registered module
*
* @method start
* @param {string} module the name of the module
*/
CoreClass.prototype.stop = function(moduleName) {
  if (!moduleName) {
      return this.stopAll();
  }

  var moduleWrapper = this.modules[moduleName];
  var stopReturn;
  
  if(!moduleWrapper || !moduleWrapper.instance) {
    //err('!stop', module);
    return false;
  }

  if(moduleWrapper.instance.destroy) {
      stopReturn = moduleWrapper.instance.destroy();
  }
  moduleWrapper.instance = null;

  Sandbox.clearNotifications(moduleName);

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
