var expect = require('chai').expect;


var server = require('../server');

describe('tester()', function(){
    it('should return hello world', function(){

        var x = 'hello world'

        sum1 = 'hello world';
        sum2 = server();

        expect(sum1).to.be.equal(sum2);
    })
})
