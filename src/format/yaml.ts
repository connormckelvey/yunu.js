import * as YAML from '../yaml'
import * as crypto from 'crypto'
import * as uuid from 'uuid'
import * as json from '../json'
import * as is from 'type-is'
import { stringify } from 'querystring';
import { type } from 'os';

export default function yaml(strings: TemplateStringsArray, ...expressions: any[]) {
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

class ZipIterator {
  callCount = 0
  length: number
  zippers: any[][]
  nextZipper: number[]

  constructor(...zippers: any[][]) {
    this.zippers = zippers
    this.length = zippers.length
    this.nextZipper = zippers.map(_ => 0)
  }

  next() {
    let idx = this.callCount++ % this.length
    const next = this.zippers[idx][this.nextZipper[idx]++]
    return next
  }
}

function tryLoad(yml: string, parts: ZipIterator) {
  const next = parts.next()
  console.log({next})
  if (typeof next === 'undefined') return yml
  try {
    const nextYAML = YAML.load(yml + next)
    return tryLoad(YAML.dump(nextYAML), parts)
  } catch (e) {
    return tryLoad(yml + JSON.stringify(next), parts)
  }
}

export function yaml2(strings: TemplateStringsArray, ...expressions: any[]) {
  return tryLoad('', new ZipIterator(strings as any, expressions))
    // yml = YAML.dump(YAML.load(
    //   yml.concat(frag, JSON.stringify(value))
    // )).trim()
  // }
  // return YAML.dump(YAML.load(yml))
}

// const types = {
//   boolean: 'boolean',
//   null: 'null',
//   undefined: 'undefined',
//   number: 'number',
//   string: 'string',
//   symbol: 'symbol',
//   function: 'function',
//   object: 'object',
//   array: 'array',
//   map: 'map',
//   set: 'set',
//   date: 'date',
// }

// function getType(data) {
//   if (data === null) return types.null
//   if (typeof data === types.boolean) return types.boolean
//   if (typeof data === types.undefined) return types.undefined
//   if (typeof data === types.number) return types.number
//   if (typeof data === types.string) return types.string
//   if (typeof data === types.symbol) return types.symbol
//   if (typeof data === types.function) return types.function
//   if (typeof data === types.object) {
//     if (data instanceof Date) return types.date
//     if (data instanceof Array) return types.array
//     if (data instanceof Map) return types.map
//     if (data instanceof Set) return types.set
//     if (data instanceof Object) return types.object
//   }
//   return typeof data
// }

// class SerializableData<T = any> {
//   static jsonTypeKey = '__yunu_SerializableData_type'
//   static jsonValueKey = '__yunu_SerializableData_value'

//   jsonTypeKey = SerializableData.jsonTypeKey
//   jsonValueKey = SerializableData.jsonValueKey

//   data: T
//   constructor(data: T) {
//     this.data = data
//   }

//   type(): string {
//     return getType(this.data)
//   }

//   toJSON() {
//     return {
//       [this.jsonTypeKey]: this.type(),
//       [this.jsonValueKey]: JSON.stringify(this.data)
//     }
//   }

//   serialize() : string {
//     return JSON.stringify(JSON.stringify(this))
//   }

//   static deserialize<T = any>(jsonStr: string): SerializableData<T> {
//     const data = json.load<T>(jsonStr, (_: string, value: any): any => {
//       if (value.hasOwnProperty(SerializableData.jsonTypeKey) && 
//       value.hasOwnProperty(SerializableData.jsonValueKey)) {
//         return json.load<T>(value[SerializableData.jsonValueKey])
//       }
//       return value
//     })
//     return new SerializableData<T>(data)
//   }
// }

// class HashMap {
//   data = new Map()
//   hash (value: any): string {
//     const hash = crypto.createHash('sha1')
//     hash.update(JSON.stringify(value))
//     return hash.digest().toString()
//   }

//   keyFor(value: any): string {
//     return this.has(value) && this.hash(value)
//   }

//   set(value: any) {
//     return this.data.set(this.hash(value), value)
//   }

//   get(key: string) {
//     return this.data.get(key)
//   }

//   has(value: any) {
//     return this.data.has(this.hash(value))
//   }
// }

// export function yaml2(strings: TemplateStringsArray, ...expressions: any[]) {
//   return strings.reduce((yml, frag, idx) => {
//     const value = expressions[idx]
//     if (typeof value === 'undefined') return yml + frag

//     const sd = new SerializableData(value)
//     const revived = YAML.load(yml.concat(frag, JSON.stringify(JSON.stringify(sd))), 
//     (_: string, value: any): any => {
//       if (getType(value) !== types.string) return value
//       try {
//         const { data } = SerializableData.deserialize(value)
//         return data
//       } catch (e) {
//         return value
//       }
//     })
//     return YAML.dump(revived).trim()
//   }, '')
// }

