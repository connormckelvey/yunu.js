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

# Yunu.js Requirments

## Problems
- General Project / Repo Layout
  - Separating, organizing and naming: 
      configs, values, tooling, documentation, etc
  - Organizing code
    - Designing Config Modules
      - Provide functions that return parsed and encoded configs generated from 
        input values.
      - File (Executable) & Importable Module
        - shebang
        - exports
          - typings
          - default: rendered configNameTemplate with defaultValues as string
          - defaultValues: sample/base/default values for template function
          - "[configNameComponent]": Name should describe the type or kind of 
            config/manifest it is producing. The function takes in a values object, 
            and returns an object
          - "[configNameTemplate]": Name should describe the type or kind of 
            config/manifest it is producing. The function takes in a values object, 
            and returns a string
            - takes snapshot and saves it as file
          - description: string containing a description of the config template
        - main
          - executes configNameTemplate template with default values and prints
            to stdout. 
          - takes snapshot and saves it as file
        - help flag
          - displays available commands, options, and the description of the 
            config
    - Designing Values Modules
      - Provides Values and Value Types for a Config Template / Component
      - Responsible for fetching and mapping values from all input sources.
      - Values modules can be shared and composed / merged
      - Could provide base / defaultValues, could provide values for specific   
        config/artifact.
      - File & Importable Module
        - exports:
          - typings
          - default: sample/base/default values for template function
          - "{[get<ValueSource>Values]}": function that return mapped values/overrides 
            from a source.
          - getValues: all/merged/mapped values for template function
            - function (default, ...overrides/partials)
          - help: help/description for options, environment variables, databases etc.
      - Organizing Values Modules
        - For every template values type there should be:
          - 1 default values module
          - 1 values selector module (select values from a given config)
          - 0 or more values provider modules (mappings from env, argv, keychain etc)
          - 0 or more instance values modules used for versioning values used in 
            producing development or production config artifacts.
        - default values, values selector modules should be located near the component
           / template files
        - other modules like values provider modules may be stored in a more high level
          location for sharing.
        - instance values modules may be stored together and organized in whatever way
    - Designing "Helper" Modules (Lib)
      - Sharing Components / Values Providers
      - Common Functions / Utils
- Managing Values / Input
  - Sources / Providers
    - Environment, Argv, Files, Web Services, Database, K/V Stores, KeyChain
    - Mapping Source To Values
  - Modifying Values
    - Deep Merge
    - Walk
    - Update / Override In Path
- Generating Configs
  - Compose, Encode, Print vs "Templating"
  - Template
    - Composition of one or more Components and an Encoder. Receives a single values
      object and returns an encoded string
  - Component
    - Function that takes a single values object. Using values it populates the corresponding fields in the config and returns it as an object
  - Encoder
    - Function that takes any javascript type and returns as an encoded string
    - Replacer func
  - Decoder
    - Opposite of Encoder
    - Reviver func
  - Instance Script
  - Logging and Reporting
- Testing
  - Code Organization
    - Keeping tests near relevant code or configs
    - Config Scripts should provide a way of running their own tests
  - Values
    - Test exports and defaults of values modules
  - Templates / Components
    - Test the exports and defaults of templates and components
  - Test Data / Fixtures
    - Use the configs you got, test what matters.
  - Testing Side Effects
    - Artifacts
    - Deployments
    - Migrations
    - Diffing Configs
    - Generating / Applying Patch files
  - Generating Tests
    - Generating tests with snapshots & values extractor
- Workflows / Life Cycle
  1. ConfigScript() 
  2. InstanceValues()
    - DefaultValues()
    - ValuesProviders()
    - Report()
  3. ConfigTemplate(InstanceValues)
    - ConfigComponent(InstanceValues)
    - ConfigEncoder(ConfigComponent)
    - Report()
  4. RenderedConfig()
     - EncodedConfig()
     - DecodedConfig()
     - Snapshot(RenderedConfig())
     - Report()
  5. ValidateConfig()
     - TestConfigTypes()
     - TestConfigValues()
     - TestConfigDryRun()
  5. SendArtifact(EncodedConfig())
     - RetrySendArtifact(EncodedConfig())
     - VerifyArtifact(EncodedConfig())
     - Report()
  7. TriggerWebhook(DecodedConfig())
     - RetryTriggerWebhook(DecodedConfig())
     - Report()
  - Artifact
    - A named, text-based config file containing a configuration rendered by a template 
      function using default and/or or values.
  - Snapshot
    - Instance of an Artifact, with name/id, timestamp, git sha, and file 
      format extension. 
    - All config modules should be set up to auto-generate and save snapshots for 
      every call to the template function.
- Delivery and Deployment
  - Destination
    - Local File System, AWS S3, Dropbox, Github, etc...
    - Webhook or other "Event" with Artifact payload and metadata.

- Developer Experience
    - Source Files as Scripts that Print Default Configs
    - Documentation / Doc Generation

- Use Cases
  - K8s
  - Prometheus Alerts Composition