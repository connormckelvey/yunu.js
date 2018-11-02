#!/usr/bin/env ts-node

import * as yaml from 'yunu/yaml';
import * as deepmerge from 'deepmerge'

const mergeValues = <T>(values: T, ...overrides: Partial<T>[]): T => {
  const [ next, ...rest ] = overrides
  if (!next) return values
  return mergeValues(deepmerge<T>(values, next), ...rest)
}

export const K8sJobManifest = (values) => yaml.dump({
  apiVersion: 'batch/v1',
  kind: 'Job',
  metadata: metadata(values),
  spec: {
    template: {
      spec: {
        restartPolicy: 'Never',
        containers: containers(values),
        volumes: volumes(values)
      }
    },
    backoffLimit: 4
  }
})

const metadata = ({ name }) => ({
  name
})

const secrets = ({ secrets, db }) => Object.entries(secrets)
  .map(([ varName, key ]) => ({
    name: varName,
    valueFrom: {
      secretKeyRef: {
        name: db.name,
        key
      }
    } 
  }))

const configs = ({ env }) => Object.entries(env)
  .map(([ name, value ]) => ({
    name,
    value
  }))

const containers = (values) => [{
  name: values.name,
  image: values.image,
  imagePullPolicy: 'IfNotPresent',
  env: [].concat(secrets(values), configs(values))
}]

const volumes = (_values) => [
  {
    name: 'cloudsql',
    emptyDir: null,
  },
  {
    name: 'ssl-certs',
    hostPath: {
      path: '/etc/ssl/certs'
    }
  }
]

const defaultValues = {
  name: "wordpress-init",
  image: "wordpress-init:latest",
  db: {
    name: "wordpress-db"
  },
  env: {
    WORDPRESS_DB_HOST: "wordpress-db-host.local",
    SITE_URL: "www.fakedoors.com",
    SITE_TITLE: "Real fake doors",
    SITE_ADMIN_EMAIL: "real@fakedoors.com"
  },
  secrets: {
    WORDPRESS_DB_NAME: "name",
    WORDPRESS_DB_USER: "user",
    WORDPRESS_DB_PASS: "pass"
  }
}

export type K8sJobManifestValues = {
  name: string
  image: string
  db: { name: string }
  secrets: { [VAR_NAME: string]: string }
  env: { [VAR_NAME: string]: string }
}

export default K8sJobManifest(defaultValues)

if (require.main === module) {
  const values = 
  mergeValues<K8sJobManifestValues>(defaultValues,
    { name: 'sauce' },
    { image: 'pics' })

  console.log(K8sJobManifest(values))
}