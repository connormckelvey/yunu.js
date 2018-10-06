import { assert } from 'chai'
import { isPrimitive } from './utils'

describe("utils.isPrimitive", function() {
  for (let [ name, test ] of Object.entries(getTests())) {
    describe(name, function() {
      it(`should return ${test.isPrimitive}`, () => {
        assert.equal(isPrimitive(test.subject), test.isPrimitive)
      })
    })
  }
})

function getTests() {
  return {
    string: { subject: "foo", isPrimitive: true},
    boolean: { subject: true, isPrimitive: true},
    int: { subject: 1, isPrimitive: true},
    float: { subject: 1.5, isPrimitive: true},
    null: { subject: null, isPrimitive: true},
    undefined: { subject: undefined, isPrimitive: true},
    symbol: { subject: Symbol("Test"), isPrimitive: true},
    array: { subject: ["foo", "bar"], isPrimitive: false},
    pojo: { subject: { foo: "bar" }, isPrimitive: false},
    map: { subject: new Map(), isPrimitive: false},
    set: { subject: new Set(), isPrimitive: false}
  }
}