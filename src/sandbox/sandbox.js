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
