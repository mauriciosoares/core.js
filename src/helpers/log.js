
/**
* Adds console.log to Core helpers
*
* @method log
*/
var log = (window.console) ? window.console.log.bind(window.console) : function() {};

Core.helpers = Core.helpers || {};
Core.helpers.log = log;
