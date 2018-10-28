import * as fs from 'fs'
import * as YAML from 'js-yaml'
import * as utils from '../utils/index'

export type Reviver = utils.WalkUpdater
export type Replacer = utils.WalkUpdater

export function load<T>(str: string, reviver?: Reviver): T {
  const data = YAML.load(str)
  if(reviver) return utils.walk(data, reviver)
  return data
}

export function loadFile<T>(path: string, reviver?: Reviver): T {
  return load(fs.readFileSync(path, { encoding: 'utf-8' }).toString(), reviver)
}

export function dump(data: any, replacer?: Replacer, options?: YAML.DumpOptions): string {
  if (replacer) return YAML.dump(utils.walk(data, replacer), options)
  return YAML.dump(data).trimRight()
}

export function dumpFile(path: string, data: any, replacer?: Replacer, options?: YAML.DumpOptions): void {
  return fs.writeFileSync(path, dump(data, replacer, options), { encoding: 'utf-8' })
}