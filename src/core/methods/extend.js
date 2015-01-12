(function(Core) {
  'use strict';

  var extensions = {};

  /**
  * Extends core functionalities
  *
  * @method extend
  * @param {string} name the name of the extension
  * @param {function | array | boolean | string | number} implementation what the extension does
  */
  var extend = function(name, implementation) {
    extensions[name] = implementation;
  };

  /**
  * returns the extension
  *
  * @method getExtension
  * @param {string} extension the name of the extension
  * @return {function | array | boolean | string | number} the implementation of the extension
  */
  var getExtension = function(extension) {
    return extensions[extension] || null;
  };

  Core.extend = extend;
  Core.getExtension = getExtension;
} (Core));
