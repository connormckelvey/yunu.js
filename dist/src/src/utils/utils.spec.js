"use strict";
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
var chai_1 = require("chai");
var utils_1 = require("./utils");
var testUtils_1 = require("../testUtils");
describe("utils", function () {
    describe("isPrimitive()", function () {
        testUtils_1.table(isPrimitiveTests(), function (_a) {
            var name = _a.name, test = __rest(_a, ["name"]);
            it("Should return " + test.isPrimitive, function () {
                chai_1.assert.equal(utils_1.isPrimitive(test.subject), test.isPrimitive);
            });
        });
    });
});
function isPrimitiveTests() {
    return [
        { name: 'string', subject: "foo", isPrimitive: true },
        { name: 'boolean', subject: true, isPrimitive: true },
        { name: 'int', subject: 1, isPrimitive: true },
        { name: 'float', subject: 1.5, isPrimitive: true },
        { name: 'null', subject: null, isPrimitive: true },
        { name: 'undefined', subject: undefined, isPrimitive: true },
        { name: 'symbol', subject: Symbol("Test"), isPrimitive: true },
        { name: 'array', subject: ["foo", "bar"], isPrimitive: false },
        { name: 'pojo', subject: { foo: "bar" }, isPrimitive: false },
        { name: 'map', subject: new Map(), isPrimitive: false },
        { name: 'set', subject: new Set(), isPrimitive: false }
    ];
}
//# sourceMappingURL=utils.spec.js.map