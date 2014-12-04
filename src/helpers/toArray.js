(function(Core) {
  var toArray = function(obj) {
    return Array.prototype.slice.call(obj);
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.toArray = toArray;
} (this.Core));
