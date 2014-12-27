/** core.js - v0.0.3 - 2014-12-27
* Copyright (c) 2014 Mauricio Soares;
* Licensed MIT 
*/

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

(function(Core) {
  var Error = function(error, message) {
    console.error(Error.messages[error], message);
  };

  Error.messages = {
    '!module': 'There\'s no module called: '
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.Error = Error;
} (this.Core));

(function(Core) {
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
} (this.Core));

(function(Core) {
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
} (this.Core));

(function(Core) {
  'use strict';

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
} (this.Core));

(function(root, Core, helpers) {
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
    var args = helpers.toArray(arguments);
    if(!helpers.isArray(notification)) return this.addNotification.apply(this, arguments);

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
      console.log('Theres already a notification called ' + notification + ', you must force the rewrite');
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

  root.Sandbox = Sandbox;
} (this, this.Core, this.Core.helpers));
