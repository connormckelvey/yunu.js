"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var toml_1 = __importDefault(require("./toml"));
var testUtils_1 = require("../testUtils");
var testDataFiles = new testUtils_1.TestData(__dirname).files();
var jsValues = {
    null: null,
    undefined: undefined,
    number: 1,
    string: "foo",
    boolean: true,
    object: { a: 1 },
    array: [1, 2, 3],
    symbol: Symbol,
    map: new Map(Object.entries({ a: 1, b: 2 })),
    set: new Set([1, 2, 3]),
    date: new Date("2018-10-25T13:53:50.994Z")
};
describe('toml', function () {
    describe('type support', function () {
        it("Should stringify and format all stringable JS types", function () {
            var actualTOML = toml_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["number = ", "\nstring = ", "\nboolean = ", "\narray = ", "\ndate = ", "\n", "\n", "\n"], ["number = ", "\nstring = ", "\nboolean = ", "\narray = ", "\ndate = ", "\n", "\n", "\n"])), jsValues.number, jsValues.string, jsValues.boolean, jsValues.array, jsValues.date, { object: jsValues.object }, { nested: jsValues });
            var expectedTOML = testDataFiles['jsData.toml'].text.trimRight();
            chai_1.assert.equal(actualTOML.trimRight(), expectedTOML);
        });
        it("Should throw a SyntaxError when stringifying iterator types", function () {
            var actualTOML = function () { return toml_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["map = ", " \nset = ", "\n"], ["map = ", " \nset = ", "\n"])), jsValues.map, jsValues.set); };
            chai_1.assert.throws(actualTOML);
        });
        it("Should throw a SyntaxError when stringifying 'undefined'", function () {
            chai_1.assert.throws(function () { return toml_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["undefined = ", ""], ["undefined = ", ""])), jsValues.undefined); });
        });
        it("Should throw a SyntaxError when stringifying 'symbol'", function () {
            chai_1.assert.throws(function () { return toml_1.default(templateObject_4 || (templateObject_4 = __makeTemplateObject(["symbol = ", ""], ["symbol = ", ""])), jsValues.symbol); });
        });
    });
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=toml.spec.js.map