import { assert } from 'chai'
import * as utils from './index'
import { table, ExportsTest } from '../testUtils'

describe('utils', function() {
  describe('exports', function() {
    it('Should contain only tested exports', () => {
      const numExported = Object.keys(utils).length
      const numTested = Object.keys(exportsTests()).length
      assert.equal(numExported, numTested)
    })
    table(exportsTests(), function({ name, ...test }) {
      it(`Should be able to import`, () => {
        assert.isDefined(utils[name])
        if (test.isFunction) assert.isFunction(utils[name])
      })
    })
  })
})

function exportsTests(): ExportsTest[] {
  return [
    { name: "walk", isFunction: true },
    { name: "isPrimitive", isFunction: true },
  ]
}