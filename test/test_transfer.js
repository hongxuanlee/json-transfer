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

    it('should update value for * (array)', () => {
        let json = jsonTrans({a: true, data: [{a: 1, b: 2}, {a: 1, b: 2}, {a: 1, b: 2}]}, [
            ['data.*.a', 11],
            ['data.*.b', 22]
        ]);
        expect(json).to.deep.equal({a: true, data: [{a: 11, b: 22}, {a: 11, b: 22}, {a: 11, b: 22}]});
        let json2 = jsonTrans({a: true, data: [{a: {c: 1}, b: 2}, {a: {c: 1}, b: 2}, {a: {c: 1}, b: 2}]}, [
            ['data.*.a.c', 11]
        ]);
        expect(json2).to.deep.equal({a: true, data: [{a: {c: 11}, b: 2}, {a: {c: 11}, b: 2}, {a: {c: 11}, b: 2}]});
    });

    it('should update value for * (object)', () => {
        let json = jsonTrans({a: true, data: {c: {a: 1, b: 2}, d: {a: 1, b: 2}, e: {a: 1, b: 2}}}, [
            ['data.*.a', 11]
        ]);
        expect(json).to.deep.equal({a: true, data: {c: {a: 11, b: 2}, d: {a: 11, b: 2}, e: {a: 11, b: 2}}});
    });

    it('should update value for * (last element)', () => {
        let json = jsonTrans({a: true, data: {c: {a: 1, b: 2}, d: {a: 1, b: 2}, e: {a: 1, b: 2}}}, [
            ['data.c.*', 11]
        ]);
        expect(json).to.deep.equal({a: true, data: {c: {a: 11, b: 11}, d: {a: 1, b: 2}, e: {a: 1, b: 2}}});
    });

    it('should set value while json is null', () => {
        let json = jsonTrans(undefined, [
            ['data.a', '1'],
            ['data.b', '2']
            ]);
        expect(json).to.deep.equal({ data: { a: '1', b: '2' } });
    });

    it('should set value while path is empty', () => {
        let json = jsonTrans({a: 1}, [
            ['', 10]
            ]);
        expect(json).to.deep.equal(10);
        let fn = () => jsonTrans({a: 1}, [
            ['', 'abcdef'],
            ['a.b', '1']
            ]);
        expect(fn).to.throw(TypeError);
        let json2 = jsonTrans({a: 1}, [
            ['', {b: 2}]
            ]);
        expect(json2).to.deep.equal({ b: 2 });
        let json3 = jsonTrans({a: 1, c: 1}, [
            ['a.', {b: 2}],
            ['c.d.', {e: 4}]
            ]);
        expect(json3).to.deep.equal({ a: { b: 2 }, c: {d: {e: 4}}});
    });

    it('should not set obj key to arr', () => {
        let fn = () => jsonTrans({a: 1, b:[{c: 1},{c: 2}]}, [
            ['b.c', '1'],
            ['b.d', '2']
            ]);
        expect(fn).to.throw(Error); 
    });
});
