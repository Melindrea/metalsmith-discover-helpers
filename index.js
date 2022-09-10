'use strict';

const defaults = require('defaults'),
  Handlebars = require('handlebars'),
  fs = require('fs'),
  path = require('path'),
  glob = require('glob');

module.exports = function (options) {
  options = defaults(options, {
    directory: 'helpers',
    pattern: '.js'
  });
  return function (files, metalsmith, done) {
    let basedir = metalsmith.path(options.directory) + '/';
    let fullPath = basedir + '**/*' + options.pattern;
    glob(fullPath, function (err, files) {
      if (err) {
        return done(err)
      }

      files.forEach(file => {
        let fn = null;
        try {
          fn = require(path.resolve(file))
        } catch (err) {
          return done(err)
        }
        let id = file.replace(basedir, '').replace(path.extname(file), '').replaceAll('/', '-');
        Handlebars.registerHelper(id, fn);
        done();
      });
    });
  }
}
