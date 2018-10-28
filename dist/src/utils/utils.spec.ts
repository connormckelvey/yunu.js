import { assert } from 'chai'
import { isPrimitive } from './utils'
import { table, TableTest } from '../testUtils'

describe("utils", function() {
  describe("isPrimitive()", function() {
    table(isPrimitiveTests(), function({name, ...test}) {
      it(`Should return ${test.isPrimitive}`, () => {
        assert.equal(isPrimitive(test.subject), test.isPrimitive)
      })
    })
  })
})

interface isPrimitiveTest {
  subject: any
  isPrimitive: boolean
}
function isPrimitiveTests(): TableTest<isPrimitiveTest>[] {
  return [
    { name: 'string', subject: "foo", isPrimitive: true},
    { name: 'boolean', subject: true, isPrimitive: true},
    { name: 'int', subject: 1, isPrimitive: true},
    { name: 'float', subject: 1.5, isPrimitive: true},
    { name: 'null', subject: null, isPrimitive: true},
    { name: 'undefined', subject: undefined, isPrimitive: true},
    { name: 'symbol', subject: Symbol("Test"), isPrimitive: true},
    { name: 'array', subject: ["foo", "bar"], isPrimitive: false},
    { name: 'pojo', subject: { foo: "bar" }, isPrimitive: false},
    { name: 'map', subject: new Map(), isPrimitive: false},
    { name: 'set', subject: new Set(), isPrimitive: false}
  ]
}