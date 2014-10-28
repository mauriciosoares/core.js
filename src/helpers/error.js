(function(Core) {
  var Error = function(error, message) {
    console.error(Error.messages[error], message);
  };

  Error.messages = {
    '!module': 'There\'s no module called: '
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.Error = Error;
} (this.Core));
