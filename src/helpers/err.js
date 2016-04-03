/**
* Handles error messages
*
* @method err
* @param {string} error the type of the error
* @param {Object} replacements message replacements
*/
var err = function(error, replacements) {
  var message = err.messages[error];
  
  for(var key in replacements) {
    if(replacements.hasOwnProperty(key)) {
      message = message.replace('@' + key, replacements[key]);
    }
  }

  Core.helpers.log(message);
};

err.messages = {
  '!deps': '"@module" requires the following dependency to be installed: "@dependency"',
  '!start': 'Could not start the given module, it\'s either already started or is not registered: @module',
  '!stop': 'Could not stop the given module, it\'s either already stopped or is not registered: @module',
  '!!module': 'Can\'t register an already registered module: @module',
  '!!listen': 'There\'s already a listen handler to the notification: @notification'
};

Core.helpers = Core.helpers || {};
Core.helpers.err = err;
