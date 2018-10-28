import * as YAML from '../yaml'
import * as utils from '../utils/index';

export default function yaml(strings: TemplateStringsArray, ...expressions: any[]) {
  return YAML.dump(YAML.load(
    strings.reduce((yml, frag, idx) => {  
      const value = expressions[idx]
      const next = yml.concat(frag)
      
      if (typeof value === 'undefined') return next
      switch (true) {
        case utils.isPrimitive(value):
          return next.concat(value)
        default:
          return next.concat(JSON.stringify(value))
      }
    }, '')
  ))
}
