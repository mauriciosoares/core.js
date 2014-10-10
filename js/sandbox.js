(function(root) {
  var Sandbox = function() {
    this.notifications = [];
  };

  Sandbox.notifications = [];

  Sandbox.prototype.notify = function(notification) {
    Sandbox.notifications.push(notification);
  };

  Sandbox.prototype.listen = function(notifications, callback, context) {

  };

  root.Sandbox = Sandbox;
} (window));
