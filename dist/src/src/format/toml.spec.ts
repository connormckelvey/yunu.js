import { assert } from 'chai'
import toml from './toml'
import { TestData } from '../testUtils'

const testDataFiles = new TestData(__dirname).files()

const jsValues = {
  null: null,
  undefined: undefined,
  number: 1,
  string: "foo",
  boolean: true,
  object: { a: 1 },
  array: [1, 2, 3],
  symbol: Symbol,
  map: new Map(Object.entries({ a: 1, b: 2 })),
  set: new Set([1,2,3]),
  date: new Date("2018-10-25T13:53:50.994Z")
}

describe('toml', function() {
  describe('type support', function() {
    it(`Should stringify and format all stringable JS types`, () => {
      const actualTOML = toml
`number = ${jsValues.number}
string = ${jsValues.string}
boolean = ${jsValues.boolean}
array = ${jsValues.array}
date = ${jsValues.date}
${{object: jsValues.object}}
${{ nested: jsValues}}
`     
      const expectedTOML = testDataFiles['jsData.toml'].text.trimRight()
      assert.equal(actualTOML.trimRight(), expectedTOML)
    })

    it(`Should throw a SyntaxError when stringifying iterator types`, () => {      
      const actualTOML = () => toml
`map = ${jsValues.map} 
set = ${jsValues.set}
`
      assert.throws(actualTOML)
    })

    it(`Should throw a SyntaxError when stringifying 'undefined'`, () => {
      assert.throws(() => toml`undefined = ${jsValues.undefined}`)
    })

    it(`Should throw a SyntaxError when stringifying 'symbol'`, () => {
      assert.throws(() => toml`symbol = ${jsValues.symbol}`)
    })
  })
})
