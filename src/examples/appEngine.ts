#!/usr/bin/env ts-node

import * as format from '../format'

export type AppEngineJsonValues = {
  bucketId: string
  deploymentFiles: string[]
  pythonRuntime: string
}

export const appEngineJson = (values: AppEngineJsonValues) =>
format.json
`{
  "deployment": {
    "files": ${values.deploymentFiles.reduce((files, file) => {
      const url = `https://storage.googleapis.com/${values.bucketId}/example-application/example-resource-${file}`
      return { ...files, [`example-resouce-${file}`]: url }
    }, {})}
  },
  "id": "v1",
  "handlers": [
    {
      "urlRegex": "/.*",
      "script": {
        "scriptPath": "example-python-app.py"
      }
    }
  ],
  "runtime": "${values.pythonRuntime}",
  "threadsafe": true
}`

const defaultValues = {
  bucketId: 'test-bucket-id',
  deploymentFiles: ['file1', 'file2'],
  pythonRuntime: 'python27'
}

export default appEngineJson(defaultValues)

if (require.main === module) {
  console.log(module.exports.default)
}