var extensions = {
    _aliases: {}
};

/**
* Extends core functionalities
*
* @method extend
* @param {string} name the name of the extension
* @param {function | array | boolean | string | number} implementation what the extension does
* @param {string} extension alias
*/
var extend = function(name, implementation, alias) {
  extensions[name] = implementation;

  if(!alias) alias = name;

  extensions._aliases[alias] = name;
};

/**
* returns the extension
*
* @method getExtension
* @param {string} name the name or alias of the extension
* @return {function | array | boolean | string | number} the implementation of the extension
*/
var getExtension = function(name) {
  if(!extensions[name]) {
    name = extensions._aliases[name];
  }

  return extensions[name] || null;
};

Core.extend = extend;
Core.getExtension = getExtension;
