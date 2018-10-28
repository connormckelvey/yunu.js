"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
__export(require("./table"));
var TestData = /** @class */ (function () {
    function TestData(parent, dataDir) {
        if (dataDir === void 0) { dataDir = 'testData'; }
        this.parent = parent;
        this.dataDir = dataDir;
    }
    TestData.prototype.path = function () {
        return path.join(this.parent, this.dataDir);
    };
    TestData.prototype.files = function () {
        var _this = this;
        return fs.readdirSync(this.path()).reduce(function (files, file) {
            var filePath = path.join(_this.path(), file);
            if (fs.lstatSync(filePath).isDirectory())
                return files;
            return __assign({}, files, (_a = {}, _a[file] = new TestDataFile(filePath), _a));
            var _a;
        }, {});
    };
    return TestData;
}());
exports.TestData = TestData;
var TestDataFile = /** @class */ (function () {
    function TestDataFile(path) {
        this.path = path;
        this.text = fs.readFileSync(path).toString();
    }
    return TestDataFile;
}());
exports.TestDataFile = TestDataFile;
//# sourceMappingURL=index.js.map