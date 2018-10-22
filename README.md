# Yunu.JS - Flexible Configuration Generation with JavaScript

Yunu.js is a less opinionated approach to data templating. With Yunu's library
of simple utilities, you can use a familiar language to generate data and configuration
files for your projects. [Learn more]() about the motivations behind this project. 

[Get Started](#get-started)

## Motivation

I find that more and more of my time is spent generating, updating and managing
configuration files/manifests for things like Kubernetes, Serverless, and 
CircleCI/TravicCI, and less time writing the underlying application source code. 
My experience with tools like like J/Ksonnet, Helm Templates and Jinja have been 
great at what they do, but choosing the wrong solution in the early stages of a 
project can become costly and painful down the road. 

At scale, some config/templating tools start to break down. For example: 
- The feature scope of one tool may require an additional tool for a slightly different problem
- Issues with whitespace may kick-off a hair-pulling debugging experience
- Lack of sophisticated editor support may result in code duplication
- Trivial logic may be difficult to read and understand within a template

At some point, every developer working with a significant amount of JSON/Yaml/Ini/Toml files will say something like:

1. "I get paid way to much to write all this YAML" or
1. "I really with I could just use a(n) class/loop/environment variable here"

*So, Y U No Use JS?*

- Javascript it a popular and well known language and it's easy to [get started]()
- NPM makes manage managing private and public dependencies easy
- Code is easy to test with packages like Mocha and Chai
- Typescript provides advanced developers with static type checking
- Javascript is pretty good parsing and encoding JSON
- Every popular text editor has syntax, language, and debugging support for Javascript

## Features

- Load utilities for reading and parsing strings and files into Javascript Objects
- Dump utilities for stingifying Javascript Objects into strings or files
- Walk utility for walking each key value pair of Javascript Objects

## Prerequisites

1. Install Node.js and NPM

## Get Started

### Initialize a new project

```bash
mkdir my_configs
cd my_configs && npm init -y
npm install --save yunu
```

### Write a config script

Create and edit redis-service.yunu.js
```javascript
var yunu = require('yunu')

module.exports.serviceYaml = function serviceYaml(values) {
  var defaultName = 'redis-master'
  var defaultValues = {
    metadata: {
      name: defaultName,
      labels: {
        app: defaultName
      }
    },
    spec: {
      ports: [{
        port: 31000,
        targetPort: 3000,
        protocol: TCP,
      }]
    }
  }

  var mergedValues = yunu.utils.deepMerge(defaultValues, values)
  var serviceManifest = yunu.kubernetes.service(mergedValues)

  return yunu.yaml.stringify(serviceManifest)
}

if(process.mainModule === module) {
  var valueOverrides = yunu.utils.Argv().values
  yunu.writeFile(yunu.utils.Argv().output, serviceYaml(valueOverrides))
}
```

### Generate the config file
```bash
node redis-service.yunu.js --output redis-service.yaml \
  --values.spec.ports[0].port = 31001
```

### Testing the config script

```bash
npm install --save-dev mocha chai
```

Update `package.json` to contain

```json
...
  "scripts": {
    "test": "mocha **/*.spec.js",
    ...
  }
...
```

Open redis-service.yunu.spec.js
```javascript
var serviceYaml = require('./redis-service').serviceYaml
var assert = require('chai').assert

describe('Redis Service YAML', function() {
  it('Should be named `redis-master`', function() {
    var yaml = serviceYaml({})
    var parsed = yunu.yaml.parse(yaml)

    assert.equal(parsed.metadata.name, 'redis-master')
    assert.equal(parsed.labels.app, 'redis-master')
  })
})
```

```bash
npm test
```
