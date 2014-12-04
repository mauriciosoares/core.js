/** core.js - v0.0.3 - 2014-12-04
* Copyright (c) 2014 Mauricio Soares;
* Licensed MIT 
*/

(function(root) {
  var Core = function() {
    this.modules = {};
  };

  Core.prototype.register = function(module, constructor) {
    this.modules[module] = {
      constructor: constructor,
      instance: null
    };
  };

  Core.prototype.moduleExist = function(module, destroy) {
    // this.helpers.Error('!module', module);
    if(destroy) return !module || !module.instance;

    return !module || module.instance;
  };

  Core.prototype.start = function(module) {
    var cModule = this.modules[module];

    if(this.moduleExist(cModule)) return;

    cModule.instance = new cModule.constructor(new root.Sandbox(module));

    if(cModule.instance.init) cModule.instance.init();
  };

  Core.prototype.stop = function(module) {
    var cModule = this.modules[module];

    if(this.moduleExist(cModule, true)) return;

    if(cModule.instance.destroy) cModule.instance.destroy();

    cModule.instance = null;

    root.Sandbox.clearNotifications(module);
  };

  Core.prototype.startAll = function() {
    this.xAll('start');
  };

  Core.prototype.stopAll = function() {
    this.xAll('stop');
  };

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
  var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.isArray = isArray;
} (this.Core));

(function(Core) {
  var toArray = function(obj) {
    return Array.prototype.slice.call(obj);
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.toArray = toArray;
} (this.Core));

(function(Core) {
  'use strict';

  Core.ex = {};

  var extend = function(name, implementation) {
    Core.ex[name] = implementation;
  };

} (this.Core));

(function(root, helpers) {
  var Sandbox = function(module) {
    this.module = module;
  };

  Sandbox.notifications = {};

  Sandbox.clearNotifications = function(module) {
    delete Sandbox.notifications[module];
  };

  Sandbox.prototype.notify = function(notification) {
    for(var module in Sandbox.notifications) {
      var listening = Sandbox.notifications[module][notification.type];
      if(listening) {
        listening.callback.call(listening.context, notification.data);
      }
    }
  };

  Sandbox.prototype.listen = function(notification) {
    var args = helpers.toArray(arguments);
    if(!helpers.isArray(notification)) return this.addNotification.apply(this, arguments);

    for(var i = 0, len = notification.length; i < len; i += 1) {
      args[0] = notification[i];
      this.addNotification.apply(this, args);
    }
  };

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

  root.Sandbox = Sandbox;
} (this, this.Core.helpers));
