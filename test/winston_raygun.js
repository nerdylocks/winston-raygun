var chai    = require('chai');
var intercept = require("intercept-stdout");
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
    var error_object = { error_type: 'Err2 Obj',
                         message: 'Err2 Obj' },
        captured_text = "",
        unhook_intercept = intercept(function(txt) {
	      captured_text += txt;
        });

    winston.error(
      'Err1 String',
      error_object,
      'Err3 String',
      //new Error('Err4 Error object'),
      'Err5 string',
      false,
      9);

    unhook_intercept();
    chai.assert(captured_text.match(/error: Err1 String { error_type: 'Err2 Obj', message: 'Err2 Obj' } Err3 String Err5 string false /));
  });

  it('allows passing in custom Raygun clients', function(){
    var raygunClient = { name: 'test raygunClient' };
    var transport = new Raygun({ raygunClient: raygunClient });
    chai.assert(transport.raygunClient === raygunClient);
  });
});
