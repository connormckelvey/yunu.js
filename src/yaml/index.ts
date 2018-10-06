import * as fs from 'fs'
import * as YAML from 'js-yaml'

type Reviver = (key: any, value: any) => any
type Replacer = (key: any, value: any) => any

function isPrimitive(test: any): boolean {
  return test !== Object(test)
}

function walkAndUpdate(subject: any, reviver: Reviver): {} {
  return Object.entries(subject).reduce((obj, [key, value]) => ({
    ...obj, 
    [key]: isPrimitive(value) 
      ? reviver(key, value)
      : reviver(key, walkAndUpdate(value, reviver))
  }), subject)
}

walkAndUpdate({a: 'b', c: 'd', e: { f: { g: 'h', i: [3,2,1] } }}, (k, v) => {
  console.log({k, v})
  return v
})

export function decode<T>(str: string, reviver?: Reviver): T {
  YAML.load(str)
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