/** core.js - v0.0.1 - 2014-10-13
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
    var module = this.modules[module];

    module.instance = new module.constructor(new Sandbox());
    module.instance.init && module.instance.init();
  };

  Core.prototype.stop = function(module) {
    var module = this.modules[module];

    module.instance.destroy && module.instance.destroy();
    module.instance = null;
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
} (window));

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
    var newListen = Sandbox.notifications[notification];
    if(!newListen) {
      newListen = {
        callback: callback,
        context: context || root
      };
    }
  };

  root.Sandbox = Sandbox;
} (window));
