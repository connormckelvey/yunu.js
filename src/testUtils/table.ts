export type TableTest<T> = T & { name: string };
export interface TableFunc<T> {
  (this: Mocha.Suite, test: TableTest<T>): void
}

export function table<T>(tests: TableTest<T>[], tableFunc: TableFunc<T>): void {
  tests.forEach(test => {
    describe(test.name, function() {
      tableFunc.call(this, test)
    })
  });
}

export type ExportsTest = TableTest<{ isFunction: boolean }>