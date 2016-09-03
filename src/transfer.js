'use strict';
/**
 * rules = [[jsonPath, value]]
 * jsonPath: 'a.b.c', 'a.0.k', '', 'a.*.d'
 * [['a.c', 0], ['a.b.d', 5]]
 * @return {json}
 */

let isString = str => typeof str === 'string';

let isArray = arr => Array.isArray(arr);

let isObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

let setValue = (json, path, value) => {
    let keys = path.split('.');
    let cur = json;
    let len = keys.length;
    for (let idx = 0; idx < keys.length; idx++) {
        let key = keys[idx];
        if (idx === len - 1) {
            cur[key] = value;
        }
        if (key === '*') {
            let all = Object.keys(cur);
            all.forEach((item) => {
                let newKeys = keys.slice(idx + 1);
                newKeys.unshift(item);
                setValue(cur, newKeys.join('.'), value);
            });
            return json;
        }
        if (cur[key]) {
            cur = cur[key];
        }
    }
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
    setValue(json, path, value);
};

let run = (json, rules = []) => {
    if (!isObject(json)) {
        throw new TypeError(`${json} is not json`);
    }
    let newJson = Object.assign({}, json);
    if (!isArray(rules)) {
        throw new TypeError(`${rules} is not array`);
    }
    rules.forEach(pairs => transfer(newJson, pairs));
    return newJson;
};

module.exports = run;