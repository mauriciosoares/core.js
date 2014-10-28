(function(root) {
  var Sandbox = function(module) {
    this.module = module;
  };

  Sandbox.notifications = {};

  Sandbox.prototype.notify = function(notification) {
    var listening = Sandbox.notifications[notification.type];
    if(listening) {
      listening.callback.call(listening.context, notification.data);
    }
  };

  Sandbox.prototype.listen = function(notification, callback, context) {
    if(!Sandbox.notifications[this.module] || !Sandbox.notifications[this.module][notification]) {
      Sandbox.notifications[this.module] = Sandbox.notifications[this.module] || {};
      Sandbox.notifications[this.module][notification] = {
        callback: callback,
        context: context || root
      };
    }
  };

  root.Sandbox = Sandbox;
} (this));
