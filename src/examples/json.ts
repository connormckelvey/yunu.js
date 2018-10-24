import * as format from '../format'
const defaultLibs = [ "es2017", "DOM" ]

export const tsconfigJson = ({ libs }) =>
format.json
`{
  "compilerOptions": {
    "target": "es5",
    "downlevelIteration": ${!!process.env.TS_DLI},
    "lib": ${libs}
  }
}
`

export default tsconfigJson({ libs: defaultLibs })

if (require.main === module) {
  console.log(module.exports.default)
}