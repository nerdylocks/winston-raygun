var chai    = require('chai');
var winston = require('winston');
var Raygun  = require(__dirname+'/../lib/winston_raygun.js');
var key     = require(__dirname+'/../config/config.json').apiKey;

describe('Winston Raygun transport', function(){
  var raygun;

  before(function(){
    winston.add(Raygun, { apiKey: key });
  });

  it('should log add Raygun transport to winston.Transport', function(){
    chai.assert(winston.transports.hasOwnProperty('Raygun'));
  });

  it('should log multiple error object', function() {
    var error_object = { error_type: 'invalid_request', message: 'error message?'}
    winston.error('TEST ERROR!', error_object, 'Error', new Error('another'), 'string', false, 9);
  })
});
