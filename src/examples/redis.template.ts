import * as deepmerge from 'deepmerge'

export const template = {
  apiVersion: 'v1',
  kind: 'ReplicationController',
  metadata: {
    name: 'master',
    labels: {
    },
  },
  spec: {
    replicas: 1,
    template: {
      metadata: {
        name: 'master',
        labels: {}
      },
      spec: {
        containers: [
        ]
      }
    }
  }
}

export default (values) => {
  return deepmerge(template, values)
}
