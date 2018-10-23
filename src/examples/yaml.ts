import * as yaml from '../yaml/format'
const defaultValues = require('./yaml_meta.json')

export const kubernetesJobManifest = values => 
yaml.format
`apiVersion: batch/v1
kind: Job
metadata:
  name: ${values.name}
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: ${values.name}
          image: ${values.image}
          imagePullPolicy: IfNotPresent
          env: 
            ${
              Object.keys(values.secrets).map(secret => ({
                name: secret,
                valueFrom: {
                  secretKeyRef: {
                    name: values.db.name,
                    key: values.secrets[secret]
                  }
                } 
              }))
              .concat(Object.keys(values.env).map(envVar => ({
                name: envVar,
                value: values.env[envVar],
              })) as any)
            }
      volumes:
        - name: cloudsql
          emptyDir: ${(function() { return null })()}
        - name: ssl-certs
          hostPath:
            path: /etc/ssl/certs
  backoffLimit: 4
`

export default kubernetesJobManifest(defaultValues)

if (require.main === module) {
  console.log(module.exports.default)
}