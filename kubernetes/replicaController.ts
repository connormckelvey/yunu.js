import * as deepmerge from 'deepmerge'
import Manifest from './manifest'

export default class {
  values: any = {}
  constructor(values) {
    this.values = deepmerge(this.values, values)
  }
  
  toJSON() {
    const values = this.values

    return {
      ...new Manifest({
        kind: 'ReplicationController',
        metadata: {
          name: values.name,
          labels: { 
            ...values.labels,
          },
        },
      }).render(),
      spec: {
        replicas: values.replicas,
        template: {
          metadata: {
            name: values.name,
            labels: values.labels
          },

          // pod spec / template
          spec: {
            containers: [
              {
                name: 'master',
                image: 'redis',
                ports: [
                  { containerPort: 6379 }
                ]
              },
              {
                name: 'collectd',
                image: values.image,
                ports: []
              }
            ]
          }
        }
      }
    }
  }
}