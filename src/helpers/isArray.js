(function(Core) {
  var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.isArray = isArray;
} (this.Core));
