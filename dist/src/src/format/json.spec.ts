import { assert } from 'chai'
import json from './json'
import { TestData } from '../testUtils'

const testDataFiles = new TestData(__dirname).files()

const jsValues = {
  null: null,
  number: 1,
  string: "foo",
  boolean: true,
  object: { a: 1 },
  array: [1, 2, 3],
  undefined: undefined,
  symbol: Symbol(),
  map: new Map(Object.entries({ a: 1, b: 2 })),
  set: new Set([1,2,3]),
  date: new Date("2018-10-25T13:53:50.994Z")
}

describe('json', function() {
  describe('type support', function() {

    it(`Should stringify and format all stringable JS types`, () => {
      const actualJSON = json`{
  "null": ${jsValues.null},
  "number": ${jsValues.number},
  "string": ${jsValues.string},
  "boolean": ${jsValues.boolean},
  "object": ${jsValues.object},
  "array": ${jsValues.array},
  "date": ${jsValues.date},
  "nested": ${jsValues}
}`

      const expectedJSON = testDataFiles['jsData.json'].text.trimRight()
      assert.equal(actualJSON, expectedJSON)
    })

    it(`Should stringify and format iterator types as empty objects`, () => {      
      const actualJSON = json
        `{"map": ${jsValues.map}, "set": ${jsValues.set} }`

      const expectedJSON = testDataFiles['iteratorData.json'].text.trimRight()
      assert.equal(actualJSON, expectedJSON)
    })

    it(`Should throw a SyntaxError when stringifying 'undefined'`, () => {
      assert.throws(() => json`{ "undefined": ${jsValues.undefined} }`)
    })

    it(`Should throw a SyntaxError when stringifying 'symbol'`, () => {
      assert.throws(() => json`{ "symbol": ${jsValues.symbol} }`)
    })
  })
})
