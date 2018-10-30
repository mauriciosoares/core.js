export {err}

/**
* Handles error messages
*
* @method err
* @param {string} error the type of the error
* @param {function} message the complementary message to the error
*/
const err = function (error, message) {
  console.error(`${messages[error]}: "${message}"`);
};

const messages = {
  '!start': `Could not start the given module, it's either already started and is not facory`,
  '!stop': `Could not stop the given module, it's either already stopped or is not registered`,
  '!!module': `Can't register an already registered module`,
  '!!listen': `There's already an listen handler to the notification`
};
