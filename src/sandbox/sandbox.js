export {Sandbox};
import {err} from "../helpers/err.js";


/**
* All notifications from sandbox
*
* @private
*/
const notifications = {};

/**
* The constructor of Sandbox
*
* @class Sandbox
* @constructor
*/
const Sandbox = class {
    constructor(module) {
        this.module = module;
    }


/**
* Notifies other modules from an specific notification
*
* @method notify
* @param {object} notification the object with notifications configs
*/
notify (notification) {
  Object.values(notifications).forEach(listener => {
      const listening = listener[notification.type];
      if (listening) {
          listening.callback.call(listening.context, notification.data);
      }
  });
}

/**
* Makes a module listen to an specific notification
*
* @method listen
* @param {string | array} notification the notification that the module will be listening to
*/
listen(notification) {
  if(!Array.isArray(notification)) return this.addNotification.apply(this, arguments);
  const args = Array.from(arguments);

  notification.forEach(aNotification => {
    args[0] = aNotification;
    this.addNotification.apply(this, args);
  });
}

/**
* Adds the module listener to the notifications configuration
*
* @method addNotification
* @param {string} notification the name of the notification
* @param {function} callback the callback that will be triggered when the notification is called
* @param {object} context the value of "this"
* @param {boolean} replace if the notification already exists, it forces to rewrite it
*/
addNotification(notification, callback, context, replace) {
  let addNotification = false;

  if (!notifications[this.module] || !notifications[this.module][notification]) {
    addNotification = true;
  } else if (replace) {
    addNotification = true;
  } else {
    err('!!listen', notification);
  }

  if(addNotification) {
    notifications[this.module] = notifications[this.module] || {};
    notifications[this.module][notification] = {
      callback: callback,
      context: context || undefined
    };
  }
}

};

    /**
* Clear all notifications from an specific module
*
* @method clearNotifications
* @param {string} module the name of the module
*/
Sandbox.clearNotifications = function(module) {
  delete notifications[module];
};
