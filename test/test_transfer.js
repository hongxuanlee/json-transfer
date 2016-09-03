'use strict';

const expect = require('chai').expect;
const jsonTrans = require('../index.js');

describe('json transfer', () => {
    it('should throw error', () => {
        let fn1 = () => jsonTrans(1);
        let fn2 = () => jsonTrans({a: 1}, 1);
        let fn3 = () => jsonTrans({a: 1}, [[1, 2, 3]]);
        let fn4 = () => jsonTrans({a: 1}, [['2', 3], [undefined, 1]]);
        expect(fn1).to.throw(TypeError);
        expect(fn2).to.throw(TypeError);
        expect(fn3).to.throw(TypeError);
        expect(fn4).to.throw(TypeError);
    });
    it('should update value for one layer', () => {
        let json1 = jsonTrans({a: 1, b: 2}, [
            ['a', 11],
            ['b', 22]
        ]);
        expect(json1).to.deep.equal({a: 11, b: 22});
    });
    it('should update value for deep layer', () => {
        let json2 = jsonTrans({a: {b: {c: 1}}}, [
            ['a.b.c', 11]
        ]);
        expect(json2).to.deep.equal({a: {b: {c: 11}}});
    });

    it('should update value for *', () => {
        let json = jsonTrans({a: true, data: [{a: 1, b: 2}, {a: 1, b: 2}, {a: 1, b: 2}]}, [
            ['data.*.a', 11]
        ]);
        expect(json).to.deep.equal({a: true, data: [{a: 11, b: 2}, {a: 11, b: 2}, {a: 11, b: 2}]});
        let json2 = jsonTrans({a: true, data: [{a: {c: 1}, b: 2}, {a: {c: 1}, b: 2}, {a: {c: 1}, b: 2}]}, [
            ['data.*.a.c', 11]
        ]);
        expect(json2).to.deep.equal({a: true, data: [{a: {c: 11}, b: 2}, {a: {c: 11}, b: 2}, {a: {c: 11}, b: 2}]});
    });

    it('should update value for *', () => {
        let json = jsonTrans({a: true, data: {c: {a: 1, b: 2}, d: {a: 1, b: 2}, e: {a: 1, b: 2}}}, [
            ['data.*.a', 11]
        ]);
        expect(json).to.deep.equal({a: true, data: {c: {a: 11, b: 2}, d: {a: 11, b: 2}, e: {a: 11, b: 2}}});
    });


});
