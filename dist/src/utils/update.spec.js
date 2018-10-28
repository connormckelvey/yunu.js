"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var update_1 = require("./update");
var chai_1 = require("chai");
describe('update', function () {
    it('should update the object', function () {
        var subject = {
            a: 'b',
            b: { c: { d: 'e' } }
        };
        var subjectJSON = JSON.stringify(subject);
        var updatedSubject = update_1.update(subject, { a: { b: 'c' } });
        chai_1.assert.equal(subjectJSON, JSON.stringify(subject));
        chai_1.assert.deepEqual(updatedSubject, __assign({}, subject, { a: { b: 'c' } }));
    });
    it('should update the object', function () {
        var subject = {
            a: 'b',
            b: { c: { d: 'e' } }
        };
        var subjectJSON = JSON.stringify(subject);
        var updatedSubject = update_1.update(subject, { a: { b: 'c' } });
        chai_1.assert.equal(subjectJSON, JSON.stringify(subject));
        chai_1.assert.deepEqual(updatedSubject, __assign({}, subject, { a: { b: 'c' } }));
    });
});
//# sourceMappingURL=update.spec.js.map