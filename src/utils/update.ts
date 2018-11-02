import * as deepmerge from 'deepmerge'

export interface Overrides {
  [key: string]: any
}

// change this function name from update to overrideValues, move this stuff to a
// values specific package.

// export function overrideValues<T>(values: T, overrides: Overrides) {}
export function update<T>(subject: T, overrides: Overrides): T {
  console.log({subject, overrides})
  return Object.entries(overrides).reduce((subj, [path, value]) => {
    console.log({subj, path, value})
    return updatePath(subject, path.split('.'),  value)
  }, subject)
}

function updatePath<T>(subject: T, [head, ...tail]: string[], value: any): T | any {
  console.log({subject, head, tail, value })
  return Object.assign({}, subject, {
    [head]: tail.length > 0
              ? updatePath(subject[head], tail, value)
              : value
  })
}

export function mergeValues<T>(values: T, ...overrides: Partial<T>[]): T {
  const [ next, ...rest ] = overrides
  if (!next) return values
  return mergeValues(deepmerge(values, next), ...rest)
}

