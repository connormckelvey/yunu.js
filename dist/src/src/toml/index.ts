import * as fs from 'fs'
import * as TOML from '@iarna/toml'
import * as utils from '../utils/index'

export type Reviver = utils.WalkUpdater
export type Replacer = utils.WalkUpdater

export function load<T>(str: string, reviver?: Reviver): T {
  const data = TOML.parse(str) as any as T
  if(reviver) return utils.walk(data, reviver)
  return data
}

export function loadFile<T>(path: string, reviver?: Reviver): T {
  return load(fs.readFileSync(path, { encoding: 'utf-8' }).toString(), reviver)
}

export function dump(data: any, replacer?: Replacer): string {
  if (replacer) return TOML.stringify(utils.walk(data, replacer))
  return TOML.stringify(data).trimRight()
}

export function dumpFile(path: string, data: any, replacer?: Replacer): void {
  return fs.writeFileSync(path, dump(data, replacer), { encoding: 'utf-8' })
}