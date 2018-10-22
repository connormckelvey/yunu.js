import * as YAML from 'js-yaml'
import * as TOML from '@iarna/toml'
import * as utils from '../utils'

function yaml(strings: TemplateStringsArray, ...expressions: any[]) {
  return YAML.dump(YAML.load(
    strings.reduce((yml, frag, idx) => {  
      const value = expressions[idx]  
      if (!value) return yml + frag
      return YAML.dump(YAML.load(
        yml.concat(frag, JSON.stringify(value))
      )).trim()
    }, '')
  ))
}


function toml(strings: TemplateStringsArray, ...expressions: any[]) {
  return TOML.stringify(TOML.parse(
    strings.reduce((tml, frag, idx) => {  
      const value = expressions[idx]  
      if (!value) return tml + frag
      return TOML.stringify(TOML.parse(
        tml.concat(frag, utils.isPrimitive(value) ? JSON.stringify(value) : TOML.stringify(value))
      )).trim()
    }, '')
  ))
}

function json(strings: TemplateStringsArray, ...expressions: any[]) {
  return JSON.stringify(JSON.parse(
    strings.reduce((jsn, frag, idx) => {
      const value = expressions[idx]
      if (!value) return jsn + frag
      return jsn.concat(frag, JSON.stringify(value))
    }, '')
  ), null, 2)
}

const replicas = 1

const metadata = {
  name: 'redis-master',
  labels: {
    name: 'redis-master'
  }
}

const containers = [
  {
    name: 'master',
    image: 'redis',
    ports: [{ containerPort: 6379 }]
  }
]

const replicationControllerTemplate = 
(metadata, replicas, containers) => yaml
`apiVesrsion: v1
kind: ReplicationController
metadata: ${metadata}
spec:
  replicas: ${replicas}
  template:
    metadata: ${metadata}
    spec:
      containers: ${containers}
        - name: collectd
          image: 'gcr.io/cooltool-1009/collectd-redis:stable'
          ports: []
`

const libs = [ "es2017", "DOM" ]

const tsconfigJsonTemplate = 
json
`{
  "compilerOptions": {
    "target": "es5",
    "downlevelIteration": true,
    "lib": ${libs}
  }
}
`

const wordpressInitValues = {
  name: 'wordpress-101',
  image: '_/wordpress:latest',
  db: {
    host: 'foo-host',
    name: 'foo-name'
  },
  env: {
    WORDPRESS_DB_HOST: 'foo-host',
    SITE_URL: 'foo-site.com',
    SITE_TITLE: 'real fake doors',
    SITE_ADMIN_USER: 'connaa@gangstazzz.com',
    SITE_ADMIN_PASSWORD: 'asdasd123',
    SITE_ADMIN_EMAIL: 'lol@aaaa.com'
  },
  secrets: {
    WORDPRESS_DB_NAME: 'name',
    WORDPRESS_DB_USER: 'user',
    WORDPRESS_DB_PASS: 'pass',
  }
}

const wordpressInit = 
values => yaml
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
            ${Object.keys(values.secrets).map(secret => ({
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
            })) as any)}
      volumes:
        - name: cloudsql
          emptyDir:
        - name: ssl-certs
          hostPath:
            path: /etc/ssl/certs
  backoffLimit: 4
`

const tomlExample = 
toml
`# This is a TOML document. Boom.

title = "TOML Example"

[owner]
name = "Tom Preston-Werner"
organization = "GitHub"
bio = "GitHub Cofounder & CEO, Likes tater tots and beer."
dob = 1979-05-27T07:32:00Z # First class dates? Why not?

[database]
server = ${"192.168.1.1"}
ports = [ 8001, 8001, 8002 ]
connection_max = 5000
enabled = true

[servers]

  # You can indent as you please. Tabs or spaces. TOML don't care.
  [servers.alpha]
  ip = "10.0.0.1"
  dc = "eqdc10"

  [servers.beta]
  ip = "10.0.0.2"
  dc = "eqdc10"
  country = "中国" # This should be parsed as UTF-8

[clients]
data = [ ["gamma", "delta"], [1, 2] ] # just an update to make sure parsers support it

# Line breaks are OK when inside arrays
hosts = [
  "alpha",
  "omega"
]

# Products

  [[products]]
  name = "Hammer"
  sku = 738594937

  [[products]]
  name = "Nail"
  sku = 284758393
  color = "gray"
`

console.log(tomlExample)
console.log(replicationControllerTemplate(metadata, replicas, containers))
console.log(tsconfigJsonTemplate)
console.log(wordpressInit(wordpressInitValues))
