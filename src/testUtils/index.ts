import * as path from 'path'
import * as fs from 'fs'
export * from './table'

export class TestData {
  parent: string
  dataDir: string

  constructor(parent: string, dataDir = 'testData') {
    this.parent = parent
    this.dataDir = dataDir
  }

  path() {
    return path.join(this.parent, this.dataDir)
  }

  files(): { [k: string]: TestDataFile } {
    return fs.readdirSync(this.path()).reduce((files, file) => {
      const filePath = path.join(this.path(), file)
      if (fs.lstatSync(filePath).isDirectory()) return files
      return { 
        ...files, 
        [file]: new TestDataFile(filePath) 
      }
    }, {})   
  }
}

export class TestDataFile {
  path: string
  readonly text: string

  constructor(path: string) {
    this.path = path
    this.text = fs.readFileSync(path).toString()
  }
}