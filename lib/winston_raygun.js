var winston = require('winston');
var raygun  = require('raygun');
var util    = require('util');

function Raygun(options) {
  var options       = options || {};
  this.name         = 'raygun';
  this.apiKey       = options.apiKey;
  this.raygunClient = options.raygunClient || new raygun.Client().init({ apiKey: this.apiKey });
  winston.Transport.call(this, options);
};

util.inherits(Raygun, winston.Transport);

winston.transports.Raygun = Raygun;

Raygun.prototype.name = 'raygun';

Raygun.prototype.log = function(level, msg, meta, callback) {
  var _this = this;
  var error;

  if (this.silent) {
    return callback(null, true);
  }

  function logged() {
    _this.emit('logged');
    callback(null, true);
  }

	if (['warn','error'].indexOf(level) > -1 && (msg instanceof Error || meta instanceof Error)) {
    error = msg instanceof Error ? msg : meta;
  } else {
    error = new Error(msg);
  }
  this.raygunClient.send(error, { }, logged, {}, []);

};

module.exports = Raygun;
