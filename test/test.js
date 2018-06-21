var expect = require('chai').expect;
<<<<<<< HEAD
var server = require('../server');

describe('tester()', function () {
  it('should return hello', function () {

    
    var sum1 = "hello";

    var sum2 = server();

    expect(sum2).to.be.equal(sum1);

  });
});
=======

var server = require('../server');

describe('tester()', function(){
    it('should return hello world', function(){

        var x = 'hello world'

        sum1 = 'hello world';
        sum2 = server();

        expect(sum1).to.be.equal(sum2);
    })
})



>>>>>>> 4dd96cac25c485eda043555a6552906294cfa826
