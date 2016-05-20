// -*- mode: js2; tab-width: 2; js2-basic-offset: 2; -*-

var winston = require('winston');
var raygun  = require('raygun');
var util    = require('util');
var os      = require('os');

function Raygun(options) {
  var options = options || {};

  this.name = 'raygun';
  this.apiKey = options.apiKey;
  this.raygunClient = options.raygunClient || new raygun.Client().init({apiKey: this.apiKey});

  this.enableLevels = ['error'];
  if (options.enableLevels) {
    this.enableLevels = (options.enableLevels.constructor === Array ? options.enableLevels : [options.enableLevels]);
  }

  this.enableStackAggregation = true;
  this.enablePropertyAggregation = false;
  this.aggregationProperties = [];
  if (options.hasOwnProperty('enableAggregation')) {
    if (options.enableAggregation.constructor === Array) {
      this.enableStackAggregation = false;
      this.enablePropertyAggregation = true;
      this.aggregationProperties = options.enableAggregation;

    } else {
      this.enableStackAggregation = options.enableAggregation;
    }
  }
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
    var messageData = [
      'Error: %s\nat ignore.ignore %s %s:0:0\n',
      message.message
    ];

    if (!this.enableStackAggregation) {
      // Raygun aggregation uses the error's stack trace, and uses the 'stack-trace' module to
      // parse it, so we have to populate it with some unique but faked data:
      var propertyData = [];

      if (this.enablePropertyAggregation) {
        // We want to extract the values of various `message` fields, and fake
        // the stack-trace with that, for aggregation:
        for (var i in this.aggregationProperties) {
          var p = this.aggregationProperties[i];
          if (message[p]) {
            propertyData.push('' + p + '="' + message[p] + '"');
          }
        }
      }

      if (propertyData.length > 0) {
        messageData.push(propertyData.join(' '), 0);

      } else {
        // We want to populate with some unique, but identifiable data, to disable
        // aggregation altogether:
        messageData.push(
          [os.hostname() || 'HOST', (process.pid ? 'pid-' + process.pid : '-')].join(' '),
          Date.now());
      }

      sendError.stack = util.format.apply(util, messageData);
    }
    return this.raygunClient.send(sendError, {error_object: message}, logged);
  }

};

module.exports = Raygun;
