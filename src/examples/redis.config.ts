import template from './redis.template'

const values = {
  metadata: {
    name: 'redis-master',
    labels: {
      name: 'redis-master'
    }
  },
  spec: {
    template: {
      metadata: {
        name: 'redis-slave',
        labels: {
          name: 'redis-slave'
        }
      },
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
            image: 'gcr.io/cooltool-1009/collectd-redis:latest',
            ports: []
          }
        ]
      }
    }
  }
}

export default JSON.stringify(template(values), null, 2)
console.log(this.default)