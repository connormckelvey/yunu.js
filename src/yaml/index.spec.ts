import * as fs from 'fs'
import * as path from 'path'
import { assert } from 'chai'
import * as tmp from 'tmp'
import * as yaml from './'
import { table, TableTest } from '../testUtils'

describe('yaml', function() {
  describe('exports', function() {
    it('Should contain only tested exports', () => {
      const numExported = Object.keys(yaml).length
      const numTested = Object.keys(exportsTests()).length
      assert.equal(numExported, numTested)
    })
    table(exportsTests(), function({ name, ...test }) {
      it(`Should be able to import`, () => {
        assert.isDefined(yaml[name])
        if (test.isFunction) assert.isFunction(yaml[name])
      })
    })
  })
  table(dataTests(), function({ name, ...test }) {
    let subjectStr = fs.readFileSync(test.subject).toString()
    describe('load()', function() {
      it(`Should parse`, () => {
        const loadedData = yaml.load(subjectStr)
        assert.deepEqual(loadedData, test.loadedData)
      })
      it(`Should parse and revive`, () => {
        const revivedData = yaml.load(subjectStr, test.reviver)
        assert.deepEqual(revivedData, test.revivedData)
      })
    })
    describe('loadFile()', function() {
      it(`Should parse file`, () => {
        const loadedData = yaml.loadFile(test.subject)
        assert.deepEqual(loadedData, test.loadedData)
      })
      it(`Should parse and revive file`, () => {
        const revivedData = yaml.loadFile(test.subject, test.reviver)
        assert.deepEqual(revivedData, test.revivedData)
      })
    })
    describe('dump()', function() {
      it(`Should stringify`, () => {
        const dumpedStr = yaml.dump(test.loadedData)
        assert.equal(dumpedStr.trimRight(), subjectStr.trimRight())
      })
      it(`Should replace and stringify`, () => {
        const revivedData = yaml.loadFile(test.subject, test.reviver)
        assert.deepEqual(revivedData, test.revivedData)
      })
    })
    describe('dumpFile()', function() {
      it('Should write a file that ends in a new line', () => {
        const file = tmp.fileSync()
        yaml.dumpFile(file.name, test.loadedData)
        const dumpedStr = fs.readFileSync(file.name).toString()
        assert.isTrue(dumpedStr.endsWith('\n'))
      })
      it(`Should stringify and write to a file`, () => {
        const file = tmp.fileSync()
        yaml.dumpFile(file.name, test.loadedData)
        const dumpedStr = fs.readFileSync(file.name).toString()
        assert.equal(dumpedStr, subjectStr)
      })
      it(`Should replace, stringify and write to a file`, () => {
        const file = tmp.fileSync()
        yaml.dumpFile(file.name, test.revivedData, test.replacer)
        const dumpedStr = fs.readFileSync(file.name).toString()
        assert.equal(dumpedStr, subjectStr)
      })
    })
  })
})

interface exportsTest { 
  isFunction: boolean 
}

function exportsTests(): TableTest<exportsTest>[] {
  return [
    { name: 'load', isFunction: true },
    { name: 'loadFile', isFunction: true },
    { name: 'dump', isFunction: true },
    { name: 'dumpFile', isFunction: true },
  ]
}

interface dataTest {
  subject: string
  loadedData: any
  reviver: yaml.Reviver
  revivedData: any
  replacer: yaml.Replacer
}

function dataTests(): TableTest<dataTest>[] {
  return [
    {
      name: 'example1',
      subject: testDataFile('example1.yaml'),
      loadedData: require('./testData/example1.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example1.loaded').revived,
      replacer: symbolReplacer,
    },
    {
      name: 'example2',
      subject: testDataFile('example2.yaml'),
      loadedData: require('./testData/example2.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example2.loaded').revived,
      replacer: symbolReplacer,
    },
    {
      name: 'example3',
      subject: testDataFile('example3.yaml'),
      loadedData: require('./testData/example3.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example3.loaded').revived,
      replacer: symbolReplacer,
    },
    {
      name: 'example4',
      subject: testDataFile('example4.yaml'),
      loadedData: require('./testData/example4.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example4.loaded').revived,
      replacer: symbolReplacer,
    },
    {
      name: 'example5',
      subject: testDataFile('example5.yaml'),
      loadedData: require('./testData/example5.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example5.loaded').revived,
      replacer: symbolReplacer,
    },
  ]
}

function testDataFile(name): string {
  return path.join(__dirname, 'testData', name)
}

function symbolReviver(key, val) {
  if (typeof val === 'string') {
    return Symbol.for(val)
  }
  return val
}

function symbolReplacer(key, val) {
  if (typeof val === 'symbol') {
    return Symbol.keyFor(val.valueOf())
  }
  return val
}