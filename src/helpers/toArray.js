(function(Core) {
  /**
  * Returns an array-like to array
  *
  * @method toArray
  * @param {object} obj The arraylike that will be converted
  * @return {array} the converted arraylike
  */
  var toArray = function(obj) {
    return Array.prototype.slice.call(obj);
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.toArray = toArray;
} (this.Core));
