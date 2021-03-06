'use strict';

const path = require('path');
const gutil = require('gulp-util');
const through = require('through2');
const fs = require('fs');
const Liquid = require('liquid-node');
const assignDeep = require('./lib/assignDeep');
const filters = require('./lib/filters');
const PluginError = gutil.PluginError;

const engine = new Liquid.Engine;
/*
 * gulp-liquid
 * @param opts.data
 * @param opts.tags
 * @param opts.filters
 **/
module.exports = function(opts) {
  const defaults = {
    filters: filters
  };

  opts = assignDeep(defaults, opts);

  if (opts.tags && typeof opts.tags === 'object') {
    /* Register liquid tags prior to processing */
    Object.keys(opts.tags).forEach(function(tag) {
      engine.registerTag(tag, opts.tags[tag]);
    });
  }

  if (opts.filters && typeof opts.filters === 'object') {
    engine.registerFilters(opts.filters);
  }

  function liquid(file, enc, callback) {
    var template;
    var promise;

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-liquid', 'Stream content is not supported'));
      return callback();
    }

    if (file.isBuffer()) {
      engine.parseAndRender(file.contents.toString(), opts.data || {})
        .then(function(output) {
          file.contents = new Buffer(output);
          this.push(file);
          callback();
        }.bind(this), function(err) {
          new PluginError('gulp-liquid', 'Error during conversion');
        });
    }
  }

  return through.obj(liquid);
};
