import { walk, WalkUpdater } from './walk'

export interface Overrides {
  [key: string]: any
}

export function update<T>(subject: T, overrides: Overrides): T {
  // console.log({subject, overrides})
  return Object.entries(overrides).reduce((subj, [path, value]) => {
    // console.log({subj, path, value})
    return updatePath(subject, path.split('.'),  value)
  }, subject)
}

function updatePath<T>(subject: T, [head, ...tail]: string[], value: any): T | any {
  // console.log({subject, head, tail, value })
  return Object.assign({}, subject, {
    [head]: tail.length > 0
              ? updatePath(subject[head], tail, value)
              : value
  })
}