import * as TOML from '@iarna/toml'
import * as utils from '../utils'

export function format(strings: TemplateStringsArray, ...expressions: any[]) {
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