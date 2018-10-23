import * as json from '../json/format'

const libs = [ "es2017", "DOM" ]

const tsconfigJsonTemplate = 
json.format
`{
  "compilerOptions": {
    "target": "es5",
    "downlevelIteration": ${!!process.env.TS_DLI},
    "lib": ${libs}
  }
}
`

console.log(tsconfigJsonTemplate)