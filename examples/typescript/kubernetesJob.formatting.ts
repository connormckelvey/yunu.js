#!/usr/bin/env ts-node

import * as format from 'yunu/format'

export type K8sJobManifestValues = {
  name: string
  image: string
  db: { name: string }
  secrets: { [VAR_NAME: string]: string }
  env: { [VAR_NAME: string]: string }
}

export const K8sJobManifest = (values: K8sJobManifestValues) => 
format.yaml
`apiVersion: batch/v1
kind: Job
metadata:
  name: ${values.name}
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - ${{name: values.name, image: values.image}}
          imagePullPolicy: IfNotPresent
          env: 
            ${
              Object.entries(values.secrets)
                .map(([ varName, key ]): SecretValue | EnvValue => ({
                  name: varName,
                  valueFrom: {
                    secretKeyRef: {
                      name: values.db.name,
                      key
                    }
                  } 
                }))
              .concat(Object.entries(values.env)
                .map(([ varName, value ]): EnvValue => ({
                  name: varName,
                  value
                })))
            }
      volumes:
        - name: cloudsql
          emptyDir: ${(function() { return null })()}
        - name: ssl-certs
          hostPath:
            path: /etc/ssl/certs
  backoffLimit: 4
`

export type SecretValue = {
  name: string
  valueFrom: {
    secretKeyRef: { name: string, key: string }
  }
}

export type EnvValue = {
  name: string
  value: string
}

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