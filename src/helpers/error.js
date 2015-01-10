(function(Core) {
  /**
  * Handles error messages
  *
  * @method err
  * @param {string} error the type of the error
  * @param {function} message the complementary message to the error
  */
  var err = function(error, message) {
    Core.helpers.log(err.messages[error] + "\"" + message + "\"");
  };

  err.messages = {
    '!start': 'Could not start the given module, it\'s either already started or is not registered: ',
    '!stop': 'Could not stop the given module, it\'s either already stopped or is not registered: ',
    'moduleExist': 'Can\'t register an already registered module: '
  };

  Core.helpers = Core.helpers || {};
  Core.helpers.err = err;
} (this.Core));
