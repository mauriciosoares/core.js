(function(Core) {
  var Error = function(message) {
    console.error(message);
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.Error = Error;
} (this.Core));
