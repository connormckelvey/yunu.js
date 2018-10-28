#!/usr/bin/env ts-node

import * as json from '../json'
import * as yargs from 'yargs'
import * as path from 'path'
import * as deepmerge from 'deepmerge'

export type PackageJsonValues = {
  version?: string
  author?: string
  main?: string
  files?: string[]
  scripts?: { [k: string]: string }
}

export const packageJson = (values: PackageJsonValues, project = process.cwd()) => {
  const original = 
    <PackageJsonValues>json.loadFile(packageJsonPath(project))

  return json.dump({
    ...original,
    version: values.version || original.version,
  })
}

const packageJsonPath = (project: string) => {
  return project.endsWith('package.json')
    ? path.resolve(project)
    : path.resolve(project, 'package.json')
}

export const defaultValues: PackageJsonValues = {
}

export default packageJson(defaultValues)

interface CLIOptions extends yargs.Arguments {
  project?: string
  values?: { [k in keyof PackageJsonValues]?: any }
}

if (require.main === module) {
  const cliArgs: CLIOptions = yargs
    .option('project', {
      alias: 'p',
      default: process.cwd()
    })
    .option('values', {
      default: {}
    }).argv
  
  const values = deepmerge.all([
    defaultValues, 
    cliArgs.values
  ])

  const updated = packageJson(values, cliArgs.project)
  console.log(updated)
}
