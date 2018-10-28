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
var walk_1 = require("./walk");
var testUtils_1 = require("../testUtils");
describe("utils", function () {
    describe('walk()', function () {
        testUtils_1.table(walkTests(), function (_a) {
            var name = _a.name, test = __rest(_a, ["name"]);
            var originalSubject = JSON.parse(JSON.stringify(test.subject));
            it("Should return an updated copy of \"" + name + ".subject\"", function () {
                var updatedSubject = walk_1.walk(test.subject, test.updater);
                chai_1.assert.deepEqual(updatedSubject, test.updatedSubject);
            });
            it("Should not mutate \"" + name + ".subject\"", function () {
                walk_1.walk(test.subject, test.updater);
                chai_1.assert.deepEqual(JSON.parse(JSON.stringify(test.subject)), originalSubject);
            });
            it("Should delete key when " + name + ".updater returns undefined", function () {
                var deletedSubject = walk_1.walk(test.subject, test.deleter);
                chai_1.assert.deepEqual(deletedSubject, test.deletedSubject);
            });
            it("Should walk \"" + name + "\" in the correct order", function () {
                var walkOrder = [];
                walk_1.walk(test.subject, function (key, value) {
                    walkOrder.push({ key: key, value: value });
                    return value;
                });
                chai_1.assert.deepEqual(walkOrder, test.walkOrder);
            });
        });
    });
});
function walkTests() {
    return [
        {
            name: 'simpleObject',
            subject: { foo: "bar", baz: "qux" },
            updater: fooUpdater,
            deleter: fooDeleter,
            walkOrder: [
                { key: "foo", value: "bar" },
                { key: "baz", value: "qux" },
            ],
            updatedSubject: { foo: "barbar", baz: "qux" },
            deletedSubject: { baz: "qux" },
        },
        {
            name: 'nestedObject',
            subject: { foo: "bar", baz: { qux: "quux" } },
            updater: fooUpdater,
            deleter: fooDeleter,
            walkOrder: [
                { key: "foo", value: "bar" },
                { key: "qux", value: "quux" },
                { key: "baz", value: { qux: "quux" } },
            ],
            updatedSubject: { foo: "barbar", baz: { qux: "quux" } },
            deletedSubject: { baz: { qux: "quux" } },
        },
        {
            name: 'objectWithArray',
            subject: { foo: "bar", baz: ["foo", "bar", "baz"] },
            updater: fooUpdater,
            deleter: fooDeleter,
            walkOrder: [
                { key: "foo", value: "bar" },
                { key: "0", value: "foo" },
                { key: "1", value: "bar" },
                { key: "2", value: "baz" },
                { key: "baz", value: ["foo", "bar", "baz"] },
            ],
            updatedSubject: { foo: "barbar", baz: ["foo", "bar", "baz"] },
            deletedSubject: { baz: ["foo", "bar", "baz"] },
        },
        {
            name: 'deeplyNestedObject',
            subject: { foo: { bar: { baz: "qux" } }, bar1: { baz1: "qux" }, baz2: "qux" },
            updater: fooUpdater,
            deleter: fooDeleter,
            walkOrder: [
                { key: "baz", value: "qux" },
                { key: "bar", value: { baz: "qux" } },
                { key: "foo", value: { bar: { baz: "qux" } } },
                { key: "baz1", value: "qux" },
                { key: "bar1", value: { baz1: "qux" } },
                { key: "baz2", value: "qux" },
            ],
            updatedSubject: { foo: "barbar", bar1: { baz1: "qux" }, baz2: "qux" },
            deletedSubject: { bar1: { baz1: "qux" }, baz2: "qux" },
        },
        {
            name: 'simpleArray',
            subject: ["foo", "bar", "baz"],
            updater: fooUpdater,
            deleter: fooDeleter,
            walkOrder: [
                { key: "0", value: "foo" },
                { key: "1", value: "bar" },
                { key: "2", value: "baz" },
            ],
            updatedSubject: ["foo", "bar", "baz"],
            deletedSubject: ["foo", "bar", "baz"],
        },
        {
            name: 'arrayOfObjects',
            subject: [{ foo: "bar" }, { baz: "qux" }],
            updater: fooUpdater,
            deleter: fooDeleter,
            walkOrder: [
                { key: "foo", value: "bar" },
                { key: "0", value: { foo: "bar" } },
                { key: "baz", value: "qux" },
                { key: "1", value: { baz: "qux" } },
            ],
            updatedSubject: [{ foo: "barbar" }, { baz: "qux" }],
            deletedSubject: [{}, { baz: "qux" }],
        },
        {
            name: 'simpleMap',
            subject: new Map([["foo", "bar"], ["baz", "qux"]]),
            updater: fooUpdater,
            deleter: fooDeleter,
            walkOrder: [
                { key: "foo", value: "bar" },
                { key: "baz", value: "qux" },
            ],
            updatedSubject: new Map([["foo", "barbar"], ["baz", "qux"]]),
            deletedSubject: new Map([["baz", "qux"]]),
        },
        {
            name: 'mapOfObjects',
            subject: new Map([["foo", { bar: "baz" }], ["bar", { baz: "qux" }]]),
            updater: fooUpdater,
            deleter: fooDeleter,
            walkOrder: [
                { key: "bar", value: "baz" },
                { key: "foo", value: { bar: "baz" } },
                { key: "baz", value: "qux" },
                { key: "bar", value: { baz: "qux" } },
            ],
            updatedSubject: new Map([["foo", "barbar"], ["bar", { baz: "qux" }]]),
            deletedSubject: new Map([["bar", { baz: "qux" }]]),
        }
    ];
}
function fooUpdater(key, val) {
    if (key === "foo") {
        return "barbar";
    }
    return val;
}
function fooDeleter(key, val) {
    if (key === "foo") {
        return;
    }
    return val;
}
//# sourceMappingURL=walk.spec.js.map