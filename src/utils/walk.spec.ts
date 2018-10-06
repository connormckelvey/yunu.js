import { assert } from 'chai'
import walk from './walk'


const fooUpdater = (key, val) =>  key === "foo" ? "barbar" : val

const getTests = () => ({
  simpleObject: {
    subject: { foo: "bar", baz: "qux" },
    updater: fooUpdater,
    expectedWalkOrder: [
      { key: "foo", value: "bar" },
      { key: "baz", value: "qux" },
    ],
    expectedUpdatedSubject: { foo: "barbar", baz: "qux" },
  },
  nestedObject: {
    subject: { foo: "bar", baz: { qux: "quux" } },
    updater: fooUpdater,
    expectedWalkOrder: [
      { key: "foo", value: "bar" },
      { key: "qux", value: "quux" },
      { key: "baz", value: { qux: "quux" } },
    ],
    expectedUpdatedSubject: { foo: "barbar", baz: { qux: "quux" } },
  },
  objectWithArray: {
    subject: { foo: "bar", baz: [ "foo", "bar", "baz" ] },
    updater: fooUpdater,
    expectedWalkOrder: [
      { key: "foo", value: "bar" },
      { key: "0", value: "foo" },
      { key: "1", value: "bar" },
      { key: "2", value: "baz" },
      { key: "baz", value: [ "foo", "bar", "baz" ] },
    ],
    expectedUpdatedSubject: { foo: "barbar",  baz: [ "foo", "bar", "baz" ] },
  },
  deeplyNestedObject: {
    subject: { foo: { bar: { baz: "qux" } }, bar1: { baz1: "qux" }, baz2: "qux" },
    updater: fooUpdater,
    expectedWalkOrder: [
      { key: "baz", value: "qux" },
      { key: "bar", value: { baz: "qux" } },
      { key: "foo", value: { bar: { baz: "qux" } } },
      { key: "baz1", value: "qux" },
      { key: "bar1", value: { baz1: "qux" } },
      { key: "baz2", value: "qux" },
    ],
    expectedUpdatedSubject: { foo: "barbar", bar1: { baz1: "qux" }, baz2: "qux" },
  },
  simpleArray: {
    subject: [ "foo", "bar", "baz" ],
    updater: fooUpdater,
    expectedWalkOrder: [
      { key: "0", value: "foo" },
      { key: "1", value: "bar" },
      { key: "2", value: "baz" },
    ],
    expectedUpdatedSubject: [ "foo", "bar", "baz" ],
  },
  arrayOfObjects: {
    subject: [{foo: "bar"}, {baz: "qux"}],
    updater: fooUpdater,
    expectedWalkOrder: [
      { key: "foo", value: "bar" },
      { key: "0", value: {foo: "bar"} },
      { key: "baz", value: "qux" },
      { key: "1", value: {baz: "qux"} },
    ],
    expectedUpdatedSubject: [{foo: "barbar"}, {baz: "qux"}],
  },
  simpleMap: {
    subject: new Map([ ["foo", "bar"], ["baz", "qux"] ]),
    updater: fooUpdater,
    expectedWalkOrder: [
      { key: "foo", value: "bar" },
      { key: "baz", value: "qux" },
    ],
    expectedUpdatedSubject: new Map([ ["foo", "barbar"], ["baz", "qux"] ]),
  },
  mapOfObjects: {
    subject: new Map<string, any>([ ["foo", { bar: "baz" }], ["bar", { baz: "qux" }] ]),
    updater: fooUpdater,
    expectedWalkOrder: [
      { key: "bar", value: "baz" },
      { key: "foo", value: { bar: "baz" } },
      { key: "baz", value: "qux" },
      { key: "bar", value: { baz: "qux" } },
    ],
    expectedUpdatedSubject: new Map<string, any>([ ["foo", "barbar"], ["bar", { baz: "qux" }] ]),
  }
})

describe("utils.walk", function() {

  for(let [ name, test ] of Object.entries(getTests())) {

    it(`should return an updated copy of "${name}.subject"`, () => {
      const actualUpdatedSubject = walk(test.subject, test.updater)
      assert.deepEqual(actualUpdatedSubject, test.expectedUpdatedSubject)
    })

    it(`should not mutate "${name}.subject"`, () => {
      assert.deepEqual(test.subject, getTests()[name].subject)
    })

    it(`Should walk "${name}" in the correct order`, () => {
      const actualWalkOrder = []
      walk(test.subject, (key, value) => {
        actualWalkOrder.push({key, value})
        return value
      })

      assert.deepEqual(actualWalkOrder, test.expectedWalkOrder)
    })
  }
})


