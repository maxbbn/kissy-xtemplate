"use strict";

var regex = {
  compress: /\.xtpl(\.|-)min\.js$/,
  handle: /\.xtpl\.js$/
};

module.exports = {
  isCompressedPath: function(pathname) {
    return regex.compress.test(pathname);
  },
  isValidPath: function(pathname) {
    return regex.handle.test(pathname);
  },
  lessError: function(err) {
    // An error while less is processing the file.
    module.exports.log('LESS ' + err.type + ' error', err.message, 'error');
    module.exports.log('LESS File', err.filename + ' ' + err.line + ':' + err.column, 'error');
  },
  log: function(key, value, type) {
    // Only log for errors.
    if(type !== 'error') {
      return;
    }

    console[type]("  \u001b[90m%s :\u001b[0m \u001b[36m%s\u001b[0m", key, value);
  },
  logDebug: function(key, value, type) {
    switch(type) {
      case 'log':
      case 'info':
      case 'error':
      case 'warn':
        break;
      default:
        type = 'log';
    }

    console[type]("  \u001b[90m%s :\u001b[0m \u001b[36m%s\u001b[0m", key, value);
  },
  maybeCompressedSource: function(pathname) {
    return (regex.compress.test(pathname)
        ? pathname.replace(regex.compress, '.xtpl.html')
        : pathname.replace(regex.handle, '.xtpl.html')
      );
  }
};
