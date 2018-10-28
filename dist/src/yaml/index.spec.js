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
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var chai_1 = require("chai");
var tmp = __importStar(require("tmp"));
var yaml = __importStar(require("./"));
var testUtils_1 = require("../testUtils");
describe('yaml', function () {
    describe('exports', function () {
        it('Should contain only tested exports', function () {
            var numExported = Object.keys(yaml).length;
            var numTested = Object.keys(exportsTests()).length;
            chai_1.assert.equal(numExported, numTested);
        });
        testUtils_1.table(exportsTests(), function (_a) {
            var name = _a.name, test = __rest(_a, ["name"]);
            it("Should be able to import", function () {
                chai_1.assert.isDefined(yaml[name]);
                if (test.isFunction)
                    chai_1.assert.isFunction(yaml[name]);
            });
        });
    });
    testUtils_1.table(dataTests(), function (_a) {
        var name = _a.name, test = __rest(_a, ["name"]);
        var subjectStr = fs.readFileSync(test.subject).toString();
        describe('load()', function () {
            it("Should parse", function () {
                var loadedData = yaml.load(subjectStr);
                chai_1.assert.deepEqual(loadedData, test.loadedData);
            });
            it("Should parse and revive", function () {
                var revivedData = yaml.load(subjectStr, test.reviver);
                chai_1.assert.deepEqual(revivedData, test.revivedData);
            });
        });
        describe('loadFile()', function () {
            it("Should parse file", function () {
                var loadedData = yaml.loadFile(test.subject);
                chai_1.assert.deepEqual(loadedData, test.loadedData);
            });
            it("Should parse and revive file", function () {
                var revivedData = yaml.loadFile(test.subject, test.reviver);
                chai_1.assert.deepEqual(revivedData, test.revivedData);
            });
        });
        describe('dump()', function () {
            it("Should stringify", function () {
                var dumpedStr = yaml.dump(test.loadedData);
                chai_1.assert.equal(dumpedStr.trimRight(), subjectStr.trimRight());
            });
            it("Should replace and stringify", function () {
                var revivedData = yaml.loadFile(test.subject, test.reviver);
                chai_1.assert.deepEqual(revivedData, test.revivedData);
            });
        });
        describe('dumpFile()', function () {
            it('Should write a file that ends in a new line', function () {
                var file = tmp.fileSync();
                yaml.dumpFile(file.name, test.loadedData);
                var dumpedStr = fs.readFileSync(file.name).toString();
                chai_1.assert.isTrue(dumpedStr.endsWith('\n'));
            });
            it("Should stringify and write to a file", function () {
                var file = tmp.fileSync();
                yaml.dumpFile(file.name, test.loadedData);
                var dumpedStr = fs.readFileSync(file.name).toString();
                chai_1.assert.equal(dumpedStr, subjectStr);
            });
            it("Should replace, stringify and write to a file", function () {
                var file = tmp.fileSync();
                yaml.dumpFile(file.name, test.revivedData, test.replacer);
                var dumpedStr = fs.readFileSync(file.name).toString();
                chai_1.assert.equal(dumpedStr, subjectStr);
            });
        });
    });
});
function exportsTests() {
    return [
        { name: 'load', isFunction: true },
        { name: 'loadFile', isFunction: true },
        { name: 'dump', isFunction: true },
        { name: 'dumpFile', isFunction: true },
    ];
}
function dataTests() {
    return [
        {
            name: 'example1',
            subject: testDataFile('example1.yaml'),
            loadedData: require('./testData/example1.loaded').loaded,
            reviver: symbolReviver,
            revivedData: require('./testData/example1.loaded').revived,
            replacer: symbolReplacer,
        },
        {
            name: 'example2',
            subject: testDataFile('example2.yaml'),
            loadedData: require('./testData/example2.loaded').loaded,
            reviver: symbolReviver,
            revivedData: require('./testData/example2.loaded').revived,
            replacer: symbolReplacer,
        },
        {
            name: 'example3',
            subject: testDataFile('example3.yaml'),
            loadedData: require('./testData/example3.loaded').loaded,
            reviver: symbolReviver,
            revivedData: require('./testData/example3.loaded').revived,
            replacer: symbolReplacer,
        },
        {
            name: 'example4',
            subject: testDataFile('example4.yaml'),
            loadedData: require('./testData/example4.loaded').loaded,
            reviver: symbolReviver,
            revivedData: require('./testData/example4.loaded').revived,
            replacer: symbolReplacer,
        },
        {
            name: 'example5',
            subject: testDataFile('example5.yaml'),
            loadedData: require('./testData/example5.loaded').loaded,
            reviver: symbolReviver,
            revivedData: require('./testData/example5.loaded').revived,
            replacer: symbolReplacer,
        },
    ];
}
function testDataFile(name) {
    return path.join(__dirname, 'testData', name);
}
function symbolReviver(key, val) {
    if (typeof val === 'string') {
        return Symbol.for(val);
    }
    return val;
}
function symbolReplacer(key, val) {
    if (typeof val === 'symbol') {
        return Symbol.keyFor(val.valueOf());
    }
    return val;
}
//# sourceMappingURL=index.spec.js.map