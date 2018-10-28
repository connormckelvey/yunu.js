import * as TOML from '@iarna/toml'
import * as utils from '../utils/index'

export default function toml(strings: TemplateStringsArray, ...expressions: any[]) {
  return TOML.stringify(TOML.parse(
    strings.reduce((tml, frag, idx) => {
      const value = expressions[idx]
      const next = tml.concat(frag)

      if (typeof value === 'undefined') return next
      switch (true) {
        case utils.isPrimitive(value):
          return next.concat(JSON.stringify(value))
        case Array.isArray(value):
          return next.concat(JSON.stringify(value))
        case value instanceof Date:
          return next.concat(JSON.stringify(value))
        default:
          return next.concat(TOML.stringify(value))
      }
    }, '')
  ))
}