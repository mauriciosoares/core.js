(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['Core'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Core'] = factory();
  }
}(this, function () {

/** 
* core.js -v0.7.3
* Copyright (c) 2016 Mauricio Soares
* Licensed MIT
*/

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

/**
* Handles error messages
*
* @method err
* @param {string} error the type of the error
* @param {Object} replacements message replacements
*/
var err = function(error, replacements) {
  var message = err.messages[error];
  
  for(var key in replacements) {
    if(replacements.hasOwnProperty(key)) {
      message = message.replace('@' + key, replacements[key]);
    }
  }

  Core.helpers.log(message);
};

err.messages = {
  '!deps': '"@module" requires the following dependency to be installed: "@dependency"',
  '!start': 'Could not start the given module, it\'s either already started or is not registered: @module',
  '!stop': 'Could not stop the given module, it\'s either already stopped or is not registered: @module',
  '!!module': 'Can\'t register an already registered module: @module',
  '!!listen': 'There\'s already a listen handler to the notification: @notification'
};

Core.helpers = Core.helpers || {};
Core.helpers.err = err;

/**
* Returns if the object is an array
*
* @method isArray
* @param {object} obj the object that will be checked
* @return {boolean} if its an array or not
*/
var isArray = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

Core.helpers = Core.helpers || {};
Core.helpers.isArray = isArray;

/**
* Adds console.log to Core helpers
*
* @method log
*/
var log = (window.console) ? window.console.log.bind(window.console) : function() {};

Core.helpers = Core.helpers || {};
Core.helpers.log = log;

/**
* Returns an array-like to array
*
* @method toArray
* @param {object} obj The arraylike that will be converted
* @return {array} the converted arraylike
*/
var toArray = function(obj) {
  return Array.prototype.slice.call(obj);
};

Core.helpers = Core.helpers || {};
Core.helpers.toArray = toArray;

var extensions = {
    _aliases: {}
};

/**
* Extends core functionalities
*
* @method extend
* @param {string} name the name of the extension
* @param {function | array | boolean | string | number} implementation what the extension does
* @param {string} extension alias
*/
var extend = function(name, implementation, alias) {
  extensions[name] = implementation;

  if(!alias) alias = name;

  extensions._aliases[alias] = name;
};

/**
* returns the extension
*
* @method getExtension
* @param {string} name the name or alias of the extension
* @return {function | array | boolean | string | number} the implementation of the extension
*/
var getExtension = function(name) {
  if(!extensions[name]) {
    name = extensions._aliases[name];
  }

  return extensions[name] || null;
};

Core.extend = extend;
Core.getExtension = getExtension;

/**
* The constructor of Sandbox
*
* @class Sandbox
* @constructor
*/
var Sandbox = function(module) {
  this.module = module;
};

// All notifications from sandbox
Sandbox.notifications = {};

/**
* Clear all notifications from an specific module
*
* @method clearNotifications
* @param {string} module the name of the module
*/
Sandbox.clearNotifications = function(module) {
  delete Sandbox.notifications[module];
};

/**
* Notifies other modules from an specific notification
*
* @method notify
* @param {object} notification the object with notifications configs
*/
Sandbox.prototype.notify = function(notification) {
  for(var module in Sandbox.notifications) {
    var listening = Sandbox.notifications[module][notification.type];
    if(listening) {
      listening.callback.call(listening.context, notification.data);
    }
  }
};

/**
* Makes a module listen to an specific notification
*
* @method listen
* @param {string | array} notification the notification that the module will be listening to
*/
Sandbox.prototype.listen = function(notification) {
  var args = Core.helpers.toArray(arguments);
  if(!Core.helpers.isArray(notification)) return this.addNotification.apply(this, arguments);

  for(var i = 0, len = notification.length; i < len; i += 1) {
    args[0] = notification[i];
    this.addNotification.apply(this, args);
  }
};

/**
* Adds the module listener to the notifications configuration
*
* @method addNotification
* @param {string} notification the name of the notification
* @param {function} callback the callback that will be triggered when the notification is called
* @param {object} context the value of "this"
* @param {boolean} replace if the notification already exists, it forces to rewrite it
*/
Sandbox.prototype.addNotification = function(notification, callback, context, replace) {
  var notifications = Sandbox.notifications,
    addNotification = false;

  if(!notifications[this.module] || !notifications[this.module][notification]) {
    addNotification = true;
  } else if(replace) {
    addNotification = true;
  } else {
    Core.helpers.err('!!listen', {
      notification: notification
    });
  }

  if(addNotification) {
    notifications[this.module] = notifications[this.module] || {};
    notifications[this.module][notification] = {
      callback: callback,
      context: context || window
    };
  }
};

/**
* Returns an extension from Core
*
* @method x
* @param {string} name the name or alias of the extension
* @return {function | array | boolean | string | number} the implementation of the extension
*/
Sandbox.prototype.use = function(name) {
  return Core.getExtension(name);
};

Core.Sandbox = Sandbox;

return Core;

}));
