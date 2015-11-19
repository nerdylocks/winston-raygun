// -*- mode: js2; tab-width: 2; js2-basic-offset: 2; -*-

var winston = require('winston');
var raygun  = require('raygun');
var util    = require('util');
var os      = require('os');

function Raygun(options) {
  var options            = options || {};
  this.name              = 'raygun';
  this.apiKey            = options.apiKey;
  this.raygunClient      = options.raygunClient || new raygun.Client().init({apiKey: this.apiKey});
  this.enableLevels      = (options.enableLevels ?
                            (options.enableLevels.constructor === Array ?
                             options.enableLevels : [options.enableLevels]) :
                            ['error']);
  this.enableAggregation = (options.hasOwnProperty('enableAggregation') ? options.enableAggregation : true);
  winston.Transport.call(this, options);
};

util.inherits(Raygun, winston.Transport);

winston.transports.Raygun = Raygun;

Raygun.prototype.name = 'raygun';

Raygun.prototype.log = function(level, msg, meta, callback) {
  var _this = this;

  var message = winston.clone(meta || {});
  message.level = level;
  message.message = msg;

  if (this.silent) {
    return callback(null, true);
  }

  function logged() {
    _this.emit('logged');
    callback(null, true);
  }

  if (this.enableLevels.indexOf(level) >= 0) {
    var sendError = new Error(message.message);
    if (!this.enableAggregation) {
      // Raygun aggregation uses the error's stack trace, and uses the 'stack-trace' module to
      // parse it, so we have to populate it with some unique but faked data:
      sendError.stack = util.format(
        'Error: %s\nat ignore.ignore %s pid-%s %s:0:0\n',
        message.message, os.hostname() || 'HOST', process.pid || '-', Date.now());
    }
    return this.raygunClient.send(sendError, {error_object: message}, logged);
  }

};

module.exports = Raygun;
