/** core.js - v0.2.0 - 2015-01-17
* Copyright (c) 2015 Mauricio Soares;
* Licensed MIT 
*/

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Core = factory();
  }
}(this, function () {

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

  if(this.moduleCheck(cModule, true)) {
    this.helpers.err('!stop', module);
    return false;
  }

  if(cModule.instance.destroy) cModule.instance.destroy();

  cModule.instance = null;

  this.Sandbox.clearNotifications(module);
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

Core = new Core();

/**
* Handles error messages
*
* @method err
* @param {string} error the type of the error
* @param {function} message the complementary message to the error
*/
var err = function(error, message) {
  Core.helpers.log(err.messages[error] + "\"" + message + "\"");
};

err.messages = {
  '!start': 'Could not start the given module, it\'s either already started or is not registered: ',
  '!stop': 'Could not stop the given module, it\'s either already stopped or is not registered: ',
  '!!module': 'Can\'t register an already registered module: ',
  '!!listen': 'There\'s already an listen handler to the notification: '
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

var extensions = {};

/**
* Extends core functionalities
*
* @method extend
* @param {string} name the name of the extension
* @param {function | array | boolean | string | number} implementation what the extension does
*/
var extend = function(name, implementation) {
  extensions[name] = implementation;
};

/**
* returns the extension
*
* @method getExtension
* @param {string} extension the name of the extension
* @return {function | array | boolean | string | number} the implementation of the extension
*/
var getExtension = function(extension) {
  return extensions[extension] || null;
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
    Core.helpers.err('!!listen', notification);
  }

  if(addNotification) {
    notifications[this.module] = notifications[this.module] || {};
    notifications[this.module][notification] = {
      callback: callback,
      context: context || root
    };
  }
};

/**
* Returns an extension from Core
*
* @method x
* @param {string} extension the name of the extension
* @return {function | array | boolean | string | number} the implementation of the extension
*/
Sandbox.prototype.x = function(extension) {
  return Core.getExtension(extension);
};

Core.Sandbox = Sandbox;

  return Core;
}));
