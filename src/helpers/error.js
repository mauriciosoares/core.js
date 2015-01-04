(function(Core) {
  var err = function(error, message) {
    console.log(err.messages[error] + message);
  };

  err.messages = {
    '!module': 'There\'s no module called: ',
    'moduleExist': 'There\'s already a module called: '
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.err = err;
} (this.Core));
