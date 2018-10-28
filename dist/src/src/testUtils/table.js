"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function table(tests, tableFunc) {
    tests.forEach(function (test) {
        describe(test.name, function () {
            tableFunc.call(this, test);
        });
    });
}
exports.table = table;
//# sourceMappingURL=table.js.map