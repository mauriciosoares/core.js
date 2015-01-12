(function(Core, root) {
  /**
  * Adds console.log to Core helpers
  *
  * @method log
  */
  var log = (root.console) ? root.console.log.bind(root.console) : function() {};

  Core.helpers = Core.helpers || {};
  Core.helpers.log = log;
} (Core, this));
