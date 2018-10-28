"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var YAML = __importStar(require("../yaml"));
var utils = __importStar(require("../utils/index"));
function yaml(strings) {
    var expressions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        expressions[_i - 1] = arguments[_i];
    }
    return YAML.dump(YAML.load(strings.reduce(function (yml, frag, idx) {
        var value = expressions[idx];
        var next = yml.concat(frag);
        if (typeof value === 'undefined')
            return next;
        switch (true) {
            case utils.isPrimitive(value):
                return next.concat(value);
            default:
                return next.concat(JSON.stringify(value));
        }
    }, '')));
}
exports.default = yaml;
//# sourceMappingURL=yaml.js.map