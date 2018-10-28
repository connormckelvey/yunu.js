import { assert } from 'chai'
import yaml from './yaml'
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

describe('yaml', function() {
  describe('type support', function() {

    it(`Should stringify and format all stringable JS types`, () => {
      const actualYAML = yaml
`null: ${jsValues.null}
undefined: ${jsValues.null}
number: ${jsValues.number}
string: ${jsValues.string}
boolean: ${jsValues.boolean}
object: ${jsValues.object}
array: ${jsValues.array}
date: ${jsValues.date}
nested: ${jsValues}
`
      const expectedYAML = testDataFiles['jsData.yaml'].text.trimRight()
      assert.equal(actualYAML, expectedYAML)
    })

    it(`Should stringify and format iterator types as empty objects`, () => {      
      const actualYAML = yaml
`map: ${jsValues.map} 
set: ${jsValues.set}
`
      const expectedYAML = testDataFiles['iteratorData.yaml'].text.trimRight()
      assert.equal(actualYAML, expectedYAML)
    })

    it(`Should throw a SyntaxError when stringifying 'symbol'`, () => {
      assert.throws(() => yaml`{ "symbol": ${jsValues.symbol} }`)
    })
  })
})
