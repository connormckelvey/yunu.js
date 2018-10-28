import { assert } from 'chai'
import { walk, WalkUpdater } from './walk'
import { table, TableTest } from '../testUtils'

describe("utils", function() {
  describe('walk()', function() {
    table(walkTests(), function({name, ...test}) {
      const originalSubject = JSON.parse(JSON.stringify(test.subject))
      it(`Should return an updated copy of "${name}.subject"`, () => {
        const updatedSubject = walk(test.subject, test.updater)
        assert.deepEqual(updatedSubject, test.updatedSubject)
      })
      it(`Should not mutate "${name}.subject"`, () => {
        walk(test.subject, test.updater)
        assert.deepEqual(JSON.parse(JSON.stringify(test.subject)), originalSubject)
      })
      it(`Should delete key when ${name}.updater returns undefined`, () => {
        const deletedSubject = walk(test.subject, test.deleter)
        assert.deepEqual(deletedSubject, test.deletedSubject)
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
  })
})

type Partial<T> = { [P in keyof T]?: T[P] }
type PartialEntry<T> = { key: string, value: Partial<T> | Partial<keyof T> }

interface walkTest {
  subject: {} | any[]
  updater: WalkUpdater
  deleter: WalkUpdater
  walkOrder: PartialEntry<{}>[]
  updatedSubject: {}
  deletedSubject: {}
}

function walkTests(): TableTest<walkTest>[] { 
  return [
    {
      name: 'simpleObject',
      subject: { foo: "bar", baz: "qux" },
      updater: fooUpdater,
      deleter: fooDeleter,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "baz", value: "qux" },
      ],
      updatedSubject: { foo: "barbar", baz: "qux" },
      deletedSubject: { baz: "qux" },
    },
    {
      name: 'nestedObject',
      subject: { foo: "bar", baz: { qux: "quux" } },
      updater: fooUpdater,
      deleter: fooDeleter,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "qux", value: "quux" },
        { key: "baz", value: { qux: "quux" } },
      ],
      updatedSubject: { foo: "barbar", baz: { qux: "quux" } },
      deletedSubject: { baz: { qux: "quux" } },
    },
    {
      name: 'objectWithArray',
      subject: { foo: "bar", baz: [ "foo", "bar", "baz" ] },
      updater: fooUpdater,
      deleter: fooDeleter,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "0", value: "foo" },
        { key: "1", value: "bar" },
        { key: "2", value: "baz" },
        { key: "baz", value: [ "foo", "bar", "baz" ] },
      ],
      updatedSubject: { foo: "barbar",  baz: [ "foo", "bar", "baz" ] },
      deletedSubject: { baz: [ "foo", "bar", "baz" ] },
    },
    {
      name: 'deeplyNestedObject',
      subject: { foo: { bar: { baz: "qux" } }, bar1: { baz1: "qux" }, baz2: "qux" },
      updater: fooUpdater,
      deleter: fooDeleter,
      walkOrder: [
        { key: "baz", value: "qux" },
        { key: "bar", value: { baz: "qux" } },
        { key: "foo", value: { bar: { baz: "qux" } } },
        { key: "baz1", value: "qux" },
        { key: "bar1", value: { baz1: "qux" } },
        { key: "baz2", value: "qux" },
      ],
      updatedSubject: { foo: "barbar", bar1: { baz1: "qux" }, baz2: "qux" },
      deletedSubject: { bar1: { baz1: "qux" }, baz2: "qux" },
    },
    {
      name: 'simpleArray',
      subject: [ "foo", "bar", "baz" ],
      updater: fooUpdater,
      deleter: fooDeleter,
      walkOrder: [
        { key: "0", value: "foo" },
        { key: "1", value: "bar" },
        { key: "2", value: "baz" },
      ],
      updatedSubject: [ "foo", "bar", "baz" ],
      deletedSubject: [ "foo", "bar", "baz" ],
    },
    {
      name: 'arrayOfObjects',
      subject: [{foo: "bar"}, {baz: "qux"}],
      updater: fooUpdater,
      deleter: fooDeleter,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "0", value: {foo: "bar"} },
        { key: "baz", value: "qux" },
        { key: "1", value: {baz: "qux"} },
      ],
      updatedSubject: [{foo: "barbar"}, {baz: "qux"}],
      deletedSubject: [{}, {baz: "qux"}],
    },
    {
      name: 'simpleMap',
      subject: new Map([ ["foo", "bar"], ["baz", "qux"] ]),
      updater: fooUpdater,
      deleter: fooDeleter,
      walkOrder: [
        { key: "foo", value: "bar" },
        { key: "baz", value: "qux" },
      ],
      updatedSubject: new Map([ ["foo", "barbar"], ["baz", "qux"] ]),
      deletedSubject: new Map([ ["baz", "qux"] ]),
    },
    {
      name: 'mapOfObjects',
      subject: new Map<string, any>([ ["foo", { bar: "baz" }], ["bar", { baz: "qux" }] ]),
      updater: fooUpdater,
      deleter: fooDeleter,
      walkOrder: [
        { key: "bar", value: "baz" },
        { key: "foo", value: { bar: "baz" } },
        { key: "baz", value: "qux" },
        { key: "bar", value: { baz: "qux" } },
      ],
      updatedSubject: new Map<string, any>([ ["foo", "barbar"], ["bar", { baz: "qux" }] ]),
      deletedSubject: new Map<string, any>([ ["bar", { baz: "qux" }] ]),
    }
  ]
}

function fooUpdater(key, val) {
  if (key === "foo") {
    return "barbar"
  }
  return val
}

function fooDeleter(key, val) {
  if (key === "foo") {
    return
  }
  return val
}