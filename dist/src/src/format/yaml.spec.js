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
var yaml_1 = __importDefault(require("./yaml"));
var testUtils_1 = require("../testUtils");
var testDataFiles = new testUtils_1.TestData(__dirname).files();
var jsValues = {
    null: null,
    number: 1,
    string: "foo",
    boolean: true,
    object: { a: 1 },
    array: [1, 2, 3],
    undefined: undefined,
    symbol: Symbol(),
    map: new Map(Object.entries({ a: 1, b: 2 })),
    set: new Set([1, 2, 3]),
    date: new Date("2018-10-25T13:53:50.994Z")
};
describe('yaml', function () {
    describe('type support', function () {
        it("Should stringify and format all stringable JS types", function () {
            var actualYAML = yaml_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["null: ", "\nundefined: ", "\nnumber: ", "\nstring: ", "\nboolean: ", "\nobject: ", "\narray: ", "\ndate: ", "\nnested: ", "\n"], ["null: ", "\nundefined: ", "\nnumber: ", "\nstring: ", "\nboolean: ", "\nobject: ", "\narray: ", "\ndate: ", "\nnested: ", "\n"])), jsValues.null, jsValues.null, jsValues.number, jsValues.string, jsValues.boolean, jsValues.object, jsValues.array, jsValues.date, jsValues);
            var expectedYAML = testDataFiles['jsData.yaml'].text.trimRight();
            chai_1.assert.equal(actualYAML, expectedYAML);
        });
        it("Should stringify and format iterator types as empty objects", function () {
            var actualYAML = yaml_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["map: ", " \nset: ", "\n"], ["map: ", " \nset: ", "\n"])), jsValues.map, jsValues.set);
            var expectedYAML = testDataFiles['iteratorData.yaml'].text.trimRight();
            chai_1.assert.equal(actualYAML, expectedYAML);
        });
        it("Should throw a SyntaxError when stringifying 'symbol'", function () {
            chai_1.assert.throws(function () { return yaml_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{ \"symbol\": ", " }"], ["{ \"symbol\": ", " }"])), jsValues.symbol); });
        });
    });
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=yaml.spec.js.map