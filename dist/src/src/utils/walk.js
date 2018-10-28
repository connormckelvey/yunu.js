"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function walk(subject, updater) {
    // Subject is an Array
    if (Array.isArray(subject))
        return walkArray(subject, updater);
    // Subject is a Map
    if (subject instanceof Map)
        return walkMap(subject, updater);
    // Subject is an POJO
    return walkObject(subject, updater);
}
exports.walk = walk;
function walkArray(array, updater) {
    return array.reduce(function (arr, value, index) {
        var updatedValue = updateEntry("" + index, value, updater, array);
        if (typeof updatedValue === "undefined") {
            return arr;
        }
        else {
            return arr.concat([updatedValue]);
        }
    }, []);
}
function walkMap(map, updater) {
    return Array.from(map.entries()).reduce(function (m, _a) {
        var key = _a[0], value = _a[1];
        var updatedValue = updateEntry(key, value, updater, map);
        if (typeof updatedValue === "undefined") {
            m.delete(key);
            return m;
        }
        return m.set(key, updatedValue);
    }, new Map(map));
}
function walkObject(object, updater) {
    return Object.entries(object).reduce(function (obj, _a) {
        var key = _a[0], value = _a[1];
        var updatedValue = updateEntry(key, value, updater, object);
        if (typeof updatedValue === "undefined") {
            var _b = key, _ = obj[_b], withoutKey = __rest(obj, [typeof _b === "symbol" ? _b : _b + ""]);
            return withoutKey;
        }
        return __assign({}, obj, (_c = {}, _c[key] = updatedValue, _c));
        var _c;
    }, object);
}
function updateEntry(key, value, updater, parent) {
    return utils_1.isPrimitive(value)
        ? updater(key, value, parent)
        : updater(key, walk(value, updater), parent);
}
//# sourceMappingURL=walk.js.map