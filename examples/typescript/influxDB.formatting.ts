#!/usr/bin/env ts-node

import * as path from 'path'
import * as format from '../format'

export type InfluxDBTomlValues = {
  influxDir: string
  loggingEnabled: boolean
  graphite: {
    enabled: boolean
    database: string
    'bind-address': string
    tags: { region: string , zone: string }
    templates: string[]
  }
}

export const influxDBToml = (values: InfluxDBTomlValues) =>
format.toml
`### Welcome to the InfluxDB configuration file.

# Bind address to use for the RPC service for backup and restore.
bind-address = "127.0.0.1:8088"

[meta]
  # Where the metadata/raft database is stored
  dir = ${path.join(values.influxDir, 'meta')}

  # If log messages are printed for the meta service
  logging-enabled = ${values.loggingEnabled}

[data]
  # The directory where the TSM storage engine stores TSM files.
  dir = ${path.join(values.influxDir, 'data')}

  # The directory where the TSM storage engine stores WAL files.
  wal-dir = ${path.join(values.influxDir, 'wal')}

[[graphite]]
${(function() { 
  const { tags, templates, ...graphite } = values.graphite 
  return graphite
})()}

  ### Default tags that will be added to all metrics.  These can be overridden at the template level
  ### or by tags extracted from metric
  tags = ${ Object.entries(values.graphite.tags).map((tag) => tag.join('=')) }

  ### Each template line requires a template pattern.  It can have an optional
  ### filter before the template and separated by spaces.  It can also have optional extra
  ### tags following the template.  Multiple tags should be separated by commas and no spaces
  ### similar to the line protocol format.  There can be only one default template.
  templates = ${values.graphite.templates}
`

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
