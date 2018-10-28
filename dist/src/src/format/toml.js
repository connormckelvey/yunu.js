"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TOML = __importStar(require("@iarna/toml"));
var utils = __importStar(require("../utils/index"));
function toml(strings) {
    var expressions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        expressions[_i - 1] = arguments[_i];
    }
    return TOML.stringify(TOML.parse(strings.reduce(function (tml, frag, idx) {
        var value = expressions[idx];
        var next = tml.concat(frag);
        if (typeof value === 'undefined')
            return next;
        switch (true) {
            case utils.isPrimitive(value):
                return next.concat(JSON.stringify(value));
            case Array.isArray(value):
                return next.concat(JSON.stringify(value));
            case value instanceof Date:
                return next.concat(JSON.stringify(value));
            default:
                return next.concat(TOML.stringify(value));
        }
    }, '')));
}
exports.default = toml;
//# sourceMappingURL=toml.js.map