
/**
* Returns if the object is an array
*
* @method isArray
* @param {object} obj the object that will be checked
* @return {boolean} if its an array or not
*/
var isArray = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

Core.helpers = Core.helpers || {};
Core.helpers.isArray = isArray;
