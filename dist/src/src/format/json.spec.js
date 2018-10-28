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
var json_1 = __importDefault(require("./json"));
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
describe('json', function () {
    describe('type support', function () {
        it("Should stringify and format all stringable JS types", function () {
            var actualJSON = json_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["{\n  \"null\": ", ",\n  \"number\": ", ",\n  \"string\": ", ",\n  \"boolean\": ", ",\n  \"object\": ", ",\n  \"array\": ", ",\n  \"date\": ", ",\n  \"nested\": ", "\n}"], ["{\n  \"null\": ", ",\n  \"number\": ", ",\n  \"string\": ", ",\n  \"boolean\": ", ",\n  \"object\": ", ",\n  \"array\": ", ",\n  \"date\": ", ",\n  \"nested\": ", "\n}"])), jsValues.null, jsValues.number, jsValues.string, jsValues.boolean, jsValues.object, jsValues.array, jsValues.date, jsValues);
            var expectedJSON = testDataFiles['jsData.json'].text.trimRight();
            chai_1.assert.equal(actualJSON, expectedJSON);
        });
        it("Should stringify and format iterator types as empty objects", function () {
            var actualJSON = json_1.default(templateObject_2 || (templateObject_2 = __makeTemplateObject(["{\"map\": ", ", \"set\": ", " }"], ["{\"map\": ", ", \"set\": ", " }"])), jsValues.map, jsValues.set);
            var expectedJSON = testDataFiles['iteratorData.json'].text.trimRight();
            chai_1.assert.equal(actualJSON, expectedJSON);
        });
        it("Should throw a SyntaxError when stringifying 'undefined'", function () {
            chai_1.assert.throws(function () { return json_1.default(templateObject_3 || (templateObject_3 = __makeTemplateObject(["{ \"undefined\": ", " }"], ["{ \"undefined\": ", " }"])), jsValues.undefined); });
        });
        it("Should throw a SyntaxError when stringifying 'symbol'", function () {
            chai_1.assert.throws(function () { return json_1.default(templateObject_4 || (templateObject_4 = __makeTemplateObject(["{ \"symbol\": ", " }"], ["{ \"symbol\": ", " }"])), jsValues.symbol); });
        });
    });
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=json.spec.js.map