"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils = __importStar(require("../utils/index"));
function json(strings) {
    var expressions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        expressions[_i - 1] = arguments[_i];
    }
    return JSON.stringify(JSON.parse(strings.reduce(function (jsn, frag, idx) {
        var value = expressions[idx];
        var next = jsn.concat(frag);
        // console.log(jsn, frag)
        if (idx === expressions.length)
            return next;
        switch (true) {
            case utils.isPrimitive(value):
                return next.concat(value);
            default:
                return next.concat(JSON.stringify(value, null, 2));
        }
    }, '')), null, 2);
}
exports.default = json;
//# sourceMappingURL=json.js.map