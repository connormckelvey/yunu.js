#!/usr/bin/env ts-node

import * as yaml from '../yaml';

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

export default K8sJobManifest(defaultValues)

if (require.main === module) {
  console.log(module.exports.default)
}