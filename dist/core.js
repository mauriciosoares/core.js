/** core.js - v0.0.2 - 2014-10-27
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

  Core.prototype.start = function(module) {
    var cModule = this.modules[module];

    if(cModule.instance) {
      return;
    }
    // debugger;
    cModule.instance = new cModule.constructor(new Sandbox());

    if(cModule.instance.init) {
      cModule.instance.init();
    }
  };

  Core.prototype.stop = function(module) {
    var cModule = this.modules[module];

    if(!cModule.instance) {
      return;
    }

    if(cModule.instance.destroy) {
      cModule.instance.destroy();
    }
    cModule.instance = null;

    delete this.modules[module];
  };

  Core.prototype.startAll = function() {
    this.xAll('start');
  };

  Core.prototype.stopAll = function() {
    this.xAll('stop');
  };

  Core.prototype.xAll = function(method) {
    for(var module in this.modules) {
      if(this.modules.hasOwnProperty(module)) {
        this[method](module);
      }
    }
  };

  root.Core = new Core();
} (this));

(function(root) {
  var Sandbox = function() {

  };

  Sandbox.notifications = {};

  Sandbox.prototype.notify = function(notification) {
    var listening = Sandbox.notifications[notification.type];
    if(listening) {
      listening.callback.call(listening.context, notification.data);
    }
  };

  Sandbox.prototype.listen = function(notification, callback, context) {
    if(!Sandbox.notifications[notification]) {
      Sandbox.notifications[notification] = {
        callback: callback,
        context: context || root
      };
    }
  };

  root.Sandbox = Sandbox;
} (this));
