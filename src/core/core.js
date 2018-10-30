export {Core, CoreClass};
import {err} from "../helpers/err.js";
import {Sandbox} from "../sandbox/sandbox.js";

/**
* The constructor of Core
*
* @class CoreClass
* @constructor
*/
const CoreClass = class {
  constructor() {  
    this.modules = {};
    this.moduleInstances = {};
  }
  
  /**
* Registers a new module
*
* @method register
* @param {string} module the name of the new module
* @param {function} constructor the constructor of the new module
*/
register (module, constructor, factory = false) {
  if(this.modules[module]) {
    err('!!module', module);
    return false;
  }
  this.modules[module] = {
    constructor,
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
start(moduleName, alias = moduleName) {
  if (!moduleName) {
      return this.xAll('start');
  }

  const moduleWrapper = this.modules[moduleName];

  if (!moduleWrapper) {
    console.error(`Could not start ${moduleName}, it must be registered first`);
    return false;
  }

  if (this.moduleInstances[alias] && !moduleWrapper.factory) {
    err('!start', moduleName);
    return false;
  }

  const instance = new moduleWrapper.constructor(new Sandbox(alias));
  this.moduleInstances[alias] = instance;

  if(instance.init) {
      return instance.init();
  }
  return true;
}

/**
* Stops a registered module
*
* @method start
* @param {string} module the name of the module
*/
stop (moduleName) {
  if (!moduleName) {
      return this.xAll('stop');
  }

  const instance = this.moduleInstances[moduleName];


  if (!instance) {
    //err('!stop', module);
    return false;
  }

  let stopReturn;
  if (instance.destroy) {
      stopReturn = instance.destroy();
  }

  delete this.moduleInstances[moduleName];

  Sandbox.clearNotifications(moduleName);

  return stopReturn;
}


/**
* Helper for startAll and stopAll
*
* @method xAll
* @param {string} method the method that will be triggered
*/
 xAll(method) {
    for(let module in this.moduleInstances) {
      if(this.modules.hasOwnProperty(module)) this[method](module);
    }
  }
};



const Core = new CoreClass();
