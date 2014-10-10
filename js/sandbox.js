(function(root) {
  var Sandbox = function() {
    this.notifications = {};
  };

  Sandbox.prototype.notify = function(notification) {
    console.log(notification.type);
    console.log(notification.data);
  };

  root.Sandbox = Sandbox;
} (window));
