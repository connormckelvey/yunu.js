"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
function load(str, reviver) {
    return JSON.parse(str, reviver);
}
exports.load = load;
function loadFile(path, reviver) {
    return load(fs.readFileSync(path, { encoding: 'utf-8' }).toString(), reviver);
}
exports.loadFile = loadFile;
function dump(data, replacer) {
    return JSON.stringify(data, replacer, 2) + "\n";
}
exports.dump = dump;
function dumpFile(path, data, replacer) {
    return fs.writeFileSync(path, dump(data, replacer), { encoding: 'utf-8' });
}
exports.dumpFile = dumpFile;
//# sourceMappingURL=index.js.map