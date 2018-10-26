import * as fs from 'fs'
import { assert } from 'chai'
import * as tmp from 'tmp'
import * as json from './'
import { table, TableTest, TestData } from '../testUtils'

describe('json', function() {
  describe('exports', function() {
    it('Should contain only tested exports', () => {
      const numExported = Object.keys(json).length
      const numTested = Object.keys(exportsTests()).length
      assert.equal(numExported, numTested)
    })
    table(exportsTests(), function({ name, ...test }) {
      it(`Should be able to import`, () => {
        assert.isDefined(json[name])
        if (test.isFunction) assert.isFunction(json[name])
      })
    })
  })
  table(dataTests(), function({ name, ...test }) {
    let subjectStr = fs.readFileSync(test.subject).toString()
    describe('load()', function() {
      it(`Should parse`, () => {
        const loadedData = json.load(subjectStr)
        assert.deepEqual(loadedData, test.loadedData)
      })
      it(`Should parse and revive`, () => {
        const revivedData = json.load(subjectStr, test.reviver)
        assert.deepEqual(revivedData, test.revivedData)
      })
    })
    describe('loadFile()', function() {
      it(`Should parse file`, () => {
        const loadedData = json.loadFile(test.subject)
        assert.deepEqual(loadedData, test.loadedData)
      })
      it(`Should parse and revive file`, () => {
        const revivedData = json.loadFile(test.subject, test.reviver)
        assert.deepEqual(revivedData, test.revivedData)
      })
    })
    describe('dump()', function() {
      it(`Should stringify`, () => {
        const dumpedStr = json.dump(test.loadedData)
        assert.equal(dumpedStr.trimRight(), subjectStr.trimRight())
      })
      it(`Should replace and stringify`, () => {
        const revivedData = json.loadFile(test.subject, test.reviver)
        assert.deepEqual(revivedData, test.revivedData)
      })
    })
    describe('dumpFile()', function() {
      it('Should write a file that ends in a new line', () => {
        const file = tmp.fileSync()
        json.dumpFile(file.name, test.loadedData)
        const dumpedStr = fs.readFileSync(file.name).toString()
        assert.isTrue(dumpedStr.endsWith('\n'))
      })
      it(`Should stringify and write to a file`, () => {
        const file = tmp.fileSync()
        json.dumpFile(file.name, test.loadedData)
        const dumpedStr = fs.readFileSync(file.name).toString()
        assert.equal(dumpedStr, subjectStr)
      })
      it(`Should replace, stringify and write to a file`, () => {
        const file = tmp.fileSync()
        json.dumpFile(file.name, test.revivedData, test.replacer)
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
  reviver: json.Reviver
  revivedData: any
  replacer: json.Replacer
}

function dataTests(): TableTest<dataTest>[] {
  const testDataFiles = new TestData(__dirname).files()
  const testDataFile = file => testDataFiles[file].path

  return [
    {
      name: 'example1',
      subject: testDataFile('example1.json'),
      loadedData: require('./testData/example1.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example1.loaded').revived,
      replacer: symbolReplacer,
    },
    {
      name: 'example2',
      subject: testDataFile('example2.json'),
      loadedData: require('./testData/example2.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example2.loaded').revived,
      replacer: symbolReplacer,
    },
    {
      name: 'example3',
      subject: testDataFile('example3.json'),
      loadedData: require('./testData/example3.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example3.loaded').revived,
      replacer: symbolReplacer,
    },
    {
      name: 'example4',
      subject: testDataFile('example4.json'),
      loadedData: require('./testData/example4.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example4.loaded').revived,
      replacer: symbolReplacer,
    },
    {
      name: 'example5',
      subject: testDataFile('example5.json'),
      loadedData: require('./testData/example5.loaded').loaded,
      reviver: symbolReviver,
      revivedData: require('./testData/example5.loaded').revived,
      replacer: symbolReplacer,
    },
  ]
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