#!/usr/bin/env ts-node

import * as path from 'path'
import * as toml from 'yunu/toml'

export const influxDBToml = (values) => toml.dump({
  'bind-address': '127.0.0.1:8088',
  meta: meta(values),
  data: data(values),
  graphite: [{
    enabled: values.graphite.enabled,
    database: values.graphite.database,
    'bind-address': values.graphite.database,
    tags: Object.entries(values.graphite.tags)
      .map((tag) => tag.join('=')),
    templates: values.graphite.templates
  }]
})

const meta = (values) => ({
  dir: path.join(values.influxDir, 'meta'),
  'logging-enabled': values.loggingEnabled
})

const data = (values) => ({
  dir: path.join(values.influxDir, 'data'),
  'logging-enabled': values.loggingEnabled,
  'wal-dir': path.join(values.influxDir, 'wal')
})

const defaultValues = {
  influxDir: '/var/lib/influxdb',
  loggingEnabled: false,
  graphite: {
    enabled: true,
    database: 'graphite',
    'bind-address': ':2003',
    tags: { region: 'us-east', zone: '1c' },
    templates: [
      '*.app env.service.resource.measurement',
      'server.*',
    ]
  }
}

export default influxDBToml(defaultValues)

if (require.main === module) {
  console.log(module.exports.default)
}
