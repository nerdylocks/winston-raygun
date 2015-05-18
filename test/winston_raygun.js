var chai    = require('chai');
var winston = require('winston');
var Raygun  = require(__dirname+'/../lib/winston_raygun.js');

describe('Winston Raygun transport', function(){

  before(function(){
    winston.add(Raygun, { apiKey: 'test_api_key' });
  });

  it('should log add Raygun transport to winston.Transport', function(){
    chai.assert(winston.transports.hasOwnProperty('Raygun'));
  });

  it('should log multiple error object', function() {
    var error_object = { error_type: 'invalid_request', message: 'error message?'}
    winston.error('TEST ERROR!', error_object, 'Error', new Error('another'), 'string', false, 9);
  })

  it('allows passing in custom Raygun clients', function(){
    var raygunClient = { name: 'test raygunClient' };
    var transport = new Raygun({ raygunClient: raygunClient })
    chai.assert(transport.raygunClient === raygunClient);
  });
});
