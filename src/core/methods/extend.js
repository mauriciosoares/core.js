(function(Core) {
  'use strict';

  var extensions = {};

  var extend = function(name, implementation) {
    extensions[name] = implementation;
  };

  var getExtension = function(extension) {
    return extensions[extension] || null;
  };

  Core.extend = extend;
  Core.getExtension = getExtension;

} (this.Core));
