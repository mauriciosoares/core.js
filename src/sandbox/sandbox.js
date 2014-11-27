(function(root) {
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

  Sandbox.prototype.listen = function(notification, callback, context, replace) {
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
} (this));
