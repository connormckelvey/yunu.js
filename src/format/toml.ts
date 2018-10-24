import * as TOML from '@iarna/toml'
import * as utils from '../utils'
// import { Readable } from 'stream'

export default function toml(strings: TemplateStringsArray, ...expressions: any[]) {
  return TOML.stringify(TOML.parse(
    strings.reduce((tml, frag, idx) => {  
      const value = expressions[idx]  
      if (typeof value === 'undefined') return tml + frag
      return TOML.stringify(TOML.parse(
        tml.concat(frag, (utils.isPrimitive(value) || Array.isArray(value)) 
          ? JSON.stringify(value) 
          : TOML.stringify(value))
      )).trim()
    }, '')
  ))
}


// export function tomlStream(strings: TemplateStringsArray, ...expressions: any[]) {  
//   const rs = new Readable()
//   let idx = 0
//   rs._read = function() {
//     const frag = strings[idx], value = expressions[idx]
//     rs.push(frag)
//     idx++

//     if (typeof value === 'undefined') {
//       rs.push(null)
//     } else if (utils.isPrimitive(value) || Array.isArray(value)) {
//       rs.push(JSON.stringify(value))
//     } else {
//       rs.push(TOML.stringify(value))
//     }
//   }
//   return TOML.parse.stream(rs).then(TOML.stringify)
// }