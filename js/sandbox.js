(function(root) {
  var Sandbox = function() {

  };

  Sandbox.notifications = {};

  Sandbox.prototype.notify = function(notification) {
    Sandbox.notifications[notification.type] = notification.data;
  };

  Sandbox.prototype.listen = function(notification, callback, context) {
    if(Sandbox.notifications[notification]) {

    }
  };

  root.Sandbox = Sandbox;
} (window));
