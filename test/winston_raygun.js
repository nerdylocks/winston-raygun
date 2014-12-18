var chai = require('chai');
var winston = require('winston');
var Raygun = require(__dirname+'/../lib/winston_raygun.js');

describe('Winston Raygun transport', function(){
  var raygun;
  before(function(){
    raygun = new Raygun({ apiKey: 'test-key' });
    winston.add(Raygun, { apiKey: 'test-key' });
  });

  it('should be instance of winston.Transport', function(){
    chai.assert(raygun instanceof winston.Transport);
  });

  it('should log add Raygun transport to winston.Transport', function(){
    chai.assert(winston.transports.hasOwnProperty('Raygun'));
  });

});
