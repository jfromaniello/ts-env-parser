"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const requiredSymbol = Symbol('required');
const typesSymbol = Symbol('types');
const validators = new Map();
validators.set(Number, v => typeof v === 'number');
validators.set(String, v => typeof v === 'string');
validators.set(Object, v => typeof v === 'object');
validators.set(Date, v => v instanceof Date);
function setting({ parser = null, required = false } = { required: false }) {
    let _val;
    return function (target, key) {
        var t = Reflect.getMetadata("design:type", target, key);
        target[typesSymbol] = target[typesSymbol] || {};
        target[typesSymbol][key] = t;
        if (!parser) {
            //default parsers
            switch (t) {
                case Number:
                    parser = parseInt;
                case String:
                    parser = v => v.toString();
                case Object:
                    parser = JSON.parse;
            }
        }
        if (required) {
            target[requiredSymbol] = target[requiredSymbol] || [];
            target[requiredSymbol].push(key);
        }
        const getter = function () {
            return _val;
        };
        const setter = function (newVal) {
            const parse = typeof newVal === 'string' && typeof parser === 'function';
            _val = parse ? parser(newVal) : newVal;
        };
        Object.defineProperty(target, key, {
            get: getter,
            set: setter
        });
    };
}
exports.setting = setting;
class EnvironmentBase {
    constructor(input = process.env) {
        Object.keys(input).forEach(k => {
            this[k] = input[k];
        });
    }
    validate() {
        (this[requiredSymbol] || []).forEach(k => {
            if (typeof this[k] === 'undefined') {
                throw new Error(`${k} is required`);
            }
        });
        Object.keys(this[typesSymbol]).forEach(prop => {
            const type = this[typesSymbol][prop];
            const validator = validators.get(type);
            if (validator && this[prop] !== 'undefined' && !validator(this[prop])) {
                throw new Error(`${prop} should be a ${type.name}`);
            }
        });
        return this;
    }
}
exports.EnvironmentBase = EnvironmentBase;
