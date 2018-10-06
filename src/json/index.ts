import * as fs from 'fs'

type Reviver = (key: any, value: any) => any
type Replacer = (key: any, value: any) => any

export function decode<T>(str: string, reviver?: Reviver): T {
  return JSON.parse(str, reviver) as T
}

export function decodeFile<T>(path: string, reviver?: Reviver): T {
  const data = fs.readFileSync(path);
  return decode(data.toString(), reviver)
}

export function encode(data: any, replacer?: Replacer): string {
  return JSON.stringify(data, replacer, 2)
}

export function encodeFile(path: string, data: any, replacer?: Replacer): void {
  return fs.writeFileSync(path, encode(data, replacer))
}

const j = decodeFile('package.json', (k, v) => {
  console.log({k, v})
  return v
})
console.log(j)

encodeFile('package2.json', j)