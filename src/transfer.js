'use strict';

/**
 * rules = [[jsonPath, value]]
 * 
 * jsonPath: 'a.b.c', 'a.0.k', '', 'a.*.d'
 * 
 * [['a.c', 0], ['a.b.d', 5]]
 * 
 * @return {json}
 */

let isString = str => typeof str === 'string';

let isArray = arr => Array.isArray(arr);

let isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

let isObjorArr = val => isArray(val) || isObject(val);

let compact = arr => arr.filter(item => item && item !== '');

let deassignObj = (obj, value) => {
    let keys = Object.keys(obj);
    keys.forEach(key => {
        delete obj[key];
    });
    Object.assign(obj, value);
};

let setValue = (json, path, value) => {
    let keys = compact(path.split('.'));
    let cur = json;
    let len = keys.length;
    if(!keys.length){
        json = value;
    }
    for (let idx = 0; idx < keys.length; idx++) {
        let key = keys[idx];
        if (key === '*') {
            let all = Object.keys(cur);
            all.forEach((item) => {
                let newKeys = keys.slice(idx + 1);
                newKeys.unshift(item);
                setValue(cur, newKeys.join('.'), value);
            });
            return json;
        }
        if (idx === len - 1) {
            if(isArray(cur) && isNaN(key)){
                throw new Error(`should not set key ${key} to array:[${cur}]`);
            }
            cur[key] = value;
            return json;
        }
        if (!cur[key] || !isObjorArr(cur[key]) ) {
            cur[key] = {};
        }
        cur = cur[key];
    }
    return json;
};

let transfer = (json, pairs) => {
    if (!isArray(pairs) || pairs.length !== 2) {
        throw new TypeError(`${pairs} is not corret pairs`);
    }
    let path = pairs[0];
    let value = pairs[1];
    if (!isString(path)) {
        throw new TypeError(`${path} is not string`);
    }
    json = setValue(json, path, value);
    return json;
};

let run = (json = {}, rules = []) => {
    if (!isObject(json)) {
        throw new TypeError(`${json} is not json`);
    }
    let newJson = Object.assign({}, json);
    if (!isArray(rules)) {
        throw new TypeError(`rules: ${rules} is not array`);
    }
    let curJson = newJson;
    rules.forEach((pairs) => {
      curJson = transfer(curJson, pairs);
    });
    return curJson;
};

module.exports = run;