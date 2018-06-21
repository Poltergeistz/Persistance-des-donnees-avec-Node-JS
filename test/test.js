var expect = require('chai').expect;
var server = require('../server');

describe('tester()', function () {
  it('should return hello', function () {

    
    var sum1 = "hello";

    var sum2 = server();

    expect(sum2).to.be.equal(sum1);

  });
});
