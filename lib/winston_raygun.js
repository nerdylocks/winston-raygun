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

  var message = winston.clone(meta || {});
  message.level = level;
  message.message = msg;

  if (this.silent) {
    return callback(null, true);
  }

  function logged(){
    _this.emit('logged');
    callback(null, true);
  }

  if (level === 'error') {
    return this.raygunClient.send(new Error(message.message), { error_object: message }, logged);
  }

};

module.exports = Raygun;
