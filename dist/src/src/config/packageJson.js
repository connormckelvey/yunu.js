#!/usr/bin/env ts-node
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
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
var json = __importStar(require("../json"));
var yargs = __importStar(require("yargs"));
var path = __importStar(require("path"));
var deepmerge = __importStar(require("deepmerge"));
exports.packageJson = function (values, project) {
    if (project === void 0) { project = process.cwd(); }
    var original = json.loadFile(packageJsonPath(project));
    return json.dump(__assign({}, original, { version: values.version || original.version }));
};
var packageJsonPath = function (project) {
    return project.endsWith('package.json')
        ? path.resolve(project)
        : path.resolve(project, 'package.json');
};
exports.defaultValues = {};
exports.default = exports.packageJson(exports.defaultValues);
if (require.main === module) {
    var cliArgs = yargs
        .option('project', {
        alias: 'p',
        default: process.cwd()
    })
        .option('values', {
        default: {}
    }).argv;
    var values = deepmerge.all([
        exports.defaultValues,
        cliArgs.values
    ]);
    var updated = exports.packageJson(values, cliArgs.project);
    console.log(updated);
}
//# sourceMappingURL=packageJson.js.map