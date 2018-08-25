'use strict';

var resolveModule = require('../lib/resolve').sync;
var resolvePath = require('path').resolve;
var parseOpts = require('../lib/minimist');
var glob = require('../vendor/glob/glob-sync');
var opts = parseOpts(process.argv.slice(2), {
  alias: { r: 'require' },
  string: 'require',
  default: { r: [] }
});
var cwd = process.cwd();

if (typeof opts.require === 'string') {
  opts.require = [opts.require];
}

opts.require.forEach(function (module) {
  if (module) {
    /* This check ensures we ignore `-r ""`, trailing `-r`, or
     * other silly things the user might (inadvertently) be doing.
     */
    require(resolveModule(module, { basedir: cwd }));
  }
});

opts._.forEach(function (arg) {
  // If glob does not match, `files` will be an empty array.
  // Note: `glob.sync` may throw an error and crash the node process.
  var files = glob(arg);

  if (!Array.isArray(files)) {
      throw new TypeError('unknown error: glob.sync did not return an array or throw. Please report this.');
  }

  files.forEach(function (file) {
      require(resolvePath(cwd, file));
  });
});
