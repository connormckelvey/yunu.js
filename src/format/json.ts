import * as utils from '../utils'

export default function json(strings: TemplateStringsArray, ...expressions: any[]) { 
  return JSON.stringify(JSON.parse(
    strings.reduce((jsn, frag, idx) => {
      const value = expressions[idx]
      const next = jsn.concat(frag)
      // console.log(jsn, frag)
      if (idx === expressions.length) return next
      switch (true) {
        case utils.isPrimitive(value):
          return next.concat(value)
        default:
          return next.concat(JSON.stringify(value, null, 2))
      }
    }, '')
  ), null, 2)
}