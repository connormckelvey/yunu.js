import { assert } from 'chai'
import walk from './walk'

describe("utils.walk", function() {
  for (let [ name, test ] of Object.entries(getTests())) {
    describe(name, function() {
      it(`should return an updated copy of "${name}.subject"`, () => {
        const updatedSubject = walk(test.subject, test.updater)
        assert.deepEqual(updatedSubject, test.updatedSubject)
      })
      it(`should not mutate "${name}.subject"`, () => {
        assert.deepEqual(test.subject, getTests()[name].subject)
      })
      it(`Should walk "${name}" in the correct order`, () => {
        const walkOrder = []
        walk(test.subject, (key, value) => {
          walkOrder.push({key, value})
          return value
        })
        assert.deepEqual(walkOrder, test.walkOrder)
      })
    })
  }
})

// Test Helpers

function fooUpdater(key, val) {
  return key === "foo" ? "barbar" : val
}  

function getTests() { 
  return {
    simpleObject: {
      subject: { foo: "bar", baz: "qux" },
      updater: fooUpdater,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "baz", value: "qux" },
      ],
      updatedSubject: { foo: "barbar", baz: "qux" },
    },
    nestedObject: {
      subject: { foo: "bar", baz: { qux: "quux" } },
      updater: fooUpdater,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "qux", value: "quux" },
        { key: "baz", value: { qux: "quux" } },
      ],
      updatedSubject: { foo: "barbar", baz: { qux: "quux" } },
    },
    objectWithArray: {
      subject: { foo: "bar", baz: [ "foo", "bar", "baz" ] },
      updater: fooUpdater,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "0", value: "foo" },
        { key: "1", value: "bar" },
        { key: "2", value: "baz" },
        { key: "baz", value: [ "foo", "bar", "baz" ] },
      ],
      updatedSubject: { foo: "barbar",  baz: [ "foo", "bar", "baz" ] },
    },
    deeplyNestedObject: {
      subject: { foo: { bar: { baz: "qux" } }, bar1: { baz1: "qux" }, baz2: "qux" },
      updater: fooUpdater,
      walkOrder: [
        { key: "baz", value: "qux" },
        { key: "bar", value: { baz: "qux" } },
        { key: "foo", value: { bar: { baz: "qux" } } },
        { key: "baz1", value: "qux" },
        { key: "bar1", value: { baz1: "qux" } },
        { key: "baz2", value: "qux" },
      ],
      updatedSubject: { foo: "barbar", bar1: { baz1: "qux" }, baz2: "qux" },
    },
    simpleArray: {
      subject: [ "foo", "bar", "baz" ],
      updater: fooUpdater,
      walkOrder: [
        { key: "0", value: "foo" },
        { key: "1", value: "bar" },
        { key: "2", value: "baz" },
      ],
      updatedSubject: [ "foo", "bar", "baz" ],
    },
    arrayOfObjects: {
      subject: [{foo: "bar"}, {baz: "qux"}],
      updater: fooUpdater,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "0", value: {foo: "bar"} },
        { key: "baz", value: "qux" },
        { key: "1", value: {baz: "qux"} },
      ],
      updatedSubject: [{foo: "barbar"}, {baz: "qux"}],
    },
    simpleMap: {
      subject: new Map([ ["foo", "bar"], ["baz", "qux"] ]),
      updater: fooUpdater,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "baz", value: "qux" },
      ],
      updatedSubject: new Map([ ["foo", "barbar"], ["baz", "qux"] ]),
    },
    mapOfObjects: {
      subject: new Map<string, any>([ ["foo", { bar: "baz" }], ["bar", { baz: "qux" }] ]),
      updater: fooUpdater,
      walkOrder: [
        { key: "bar", value: "baz" },
        { key: "foo", value: { bar: "baz" } },
        { key: "baz", value: "qux" },
        { key: "bar", value: { baz: "qux" } },
      ],
      updatedSubject: new Map<string, any>([ ["foo", "barbar"], ["bar", { baz: "qux" }] ]),
    }
  }
}
