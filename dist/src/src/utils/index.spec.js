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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var utils = __importStar(require("./index"));
var testUtils_1 = require("../testUtils");
describe('utils', function () {
    describe('exports', function () {
        it('Should contain only tested exports', function () {
            var numExported = Object.keys(utils).length;
            var numTested = Object.keys(exportsTests()).length;
            chai_1.assert.equal(numExported, numTested);
        });
        testUtils_1.table(exportsTests(), function (_a) {
            var name = _a.name, test = __rest(_a, ["name"]);
            it("Should be able to import", function () {
                chai_1.assert.isDefined(utils[name]);
                if (test.isFunction)
                    chai_1.assert.isFunction(utils[name]);
            });
        });
    });
});
function exportsTests() {
    return [
        { name: "walk", isFunction: true },
        { name: "isPrimitive", isFunction: true },
    ];
}
//# sourceMappingURL=index.spec.js.map