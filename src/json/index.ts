import * as fs from 'fs'
import * as utils from '../utils'

export type Reviver = utils.WalkUpdater
export type Replacer = utils.WalkUpdater

export function load<T>(str: string, reviver?: Reviver): T {
  return JSON.parse(str, reviver)
}

export function loadFile<T>(path: string, reviver?: Reviver): T {
  return load(fs.readFileSync(path, { encoding: 'utf-8' }).toString(), reviver)
}

export function dump(data: any, replacer?: Replacer): string {
  return JSON.stringify(data, replacer, 2) + "\n"
}

export function dumpFile(path: string, data: any, replacer?: Replacer): void {
  return fs.writeFileSync(path, dump(data, replacer), { encoding: 'utf-8' })
}