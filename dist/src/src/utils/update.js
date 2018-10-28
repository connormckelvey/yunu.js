"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function update(subject, overrides) {
    // console.log({subject, overrides})
    return Object.entries(overrides).reduce(function (subj, _a) {
        var path = _a[0], value = _a[1];
        // console.log({subj, path, value})
        return updatePath(subject, path.split('.'), value);
    }, subject);
}
exports.update = update;
function updatePath(subject, _a, value) {
    var head = _a[0], tail = _a.slice(1);
    // console.log({subject, head, tail, value })
    return Object.assign({}, subject, (_b = {},
        _b[head] = tail.length > 0
            ? updatePath(subject[head], tail, value)
            : value,
        _b));
    var _b;
}
//# sourceMappingURL=update.js.map