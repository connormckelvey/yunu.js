export default function json(strings: TemplateStringsArray, ...expressions: any[]) {
  return JSON.stringify(JSON.parse(
    strings.reduce((jsn, frag, idx) => {
      const value = expressions[idx]
      if (typeof value === 'undefined') return jsn + frag
      return jsn.concat(frag, JSON.stringify(value))
    }, '')
  ), null, 2)
}