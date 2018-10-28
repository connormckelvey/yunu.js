import { assert } from 'chai'
import * as format from './'
import { table, TableTest } from '../testUtils'

describe('format', function() {
  describe('exports', function() {
    it('Should contain only tested exports', () => {
      const numExported = Object.keys(format).length
      const numTested = Object.keys(exportsTests()).length
      assert.equal(numExported, numTested)
    })
    table(exportsTests(), function({ name, ...test }) {
      it(`Should be able to import`, () => {
        assert.isDefined(format[name])
        if (test.isFunction) assert.isFunction(format[name])
      })
    })
  })
})

interface exportsTest { 
  isFunction: boolean 
}

function exportsTests(): TableTest<exportsTest>[] {
  return [
    { name: 'json', isFunction: true },
    { name: 'toml', isFunction: true },
    { name: 'yaml', isFunction: true },
  ]
}