import * as YAML from 'js-yaml'

export function format(strings: TemplateStringsArray, ...expressions: any[]) {
  return YAML.dump(YAML.load(
    strings.reduce((yml, frag, idx) => {  
      const value = expressions[idx]  
      if (typeof value === 'undefined') return yml + frag
      return YAML.dump(YAML.load(
        yml.concat(frag, JSON.stringify(value))
      )).trim()
    }, '')
  ))
}