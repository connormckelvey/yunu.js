#!/usr/bin/env node

const utils = require('yunu/utils')
const json = require('yunu/json')

const appEngineJson = exports.appEngineJson = (values) => json.dump({
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

exports.default = appEngineJson(defaultValues)

if (require.main === module) {
  console.log(exports.default)
}