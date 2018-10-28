#!/usr/bin/env ts-node

import * as json from 'yunu/json'

export const appEngineJson = (values) => json.dump({
  deployment: {
    files: values.deploymentFiles.reduce((files, file) => {
      const resource = `example-resource-${file}`
      const url = resourceUrl(values)(resource)
      return { ...files, [resource]: url }
    }, {})
  },
  id: "v1",
  handlers: [{
    urlRegex: "/.*",
    script: {
      scriptPath: "example-python-app.py"
    }
  }],
  runtime: values.pythonRuntime,
  threadsafe: true
})

const resourceUrl = (values) => (resource) => {
  const bucketRoot = `https://storage.googleapis.com/${values.bucketId}`
  return `${bucketRoot}/${values.appName}/${resource}`
}

const defaultValues = {
  appName: 'test-application',
  bucketId: 'test-bucket-id',
  deploymentFiles: ['file1', 'file2'],
  pythonRuntime: 'python27'
}

export default appEngineJson(defaultValues)

if (require.main === module) {
  console.log(module.exports.default)
}