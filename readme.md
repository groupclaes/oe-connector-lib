**OE-Connector Library**

# Index
- [Index](#index)
- [Installation](#installation)
- [Usage](#usage)
  - [Require oe-connector](#require-oe-connector)
  - [Running procedures](#running-procedures)
  - [Configuration](#configuration)
- [Docs](#docs)
- [FAQ](#faq)
- [Credits](#credits)

# Installation
```sh
npm install @groupclaes/oe-connector --save
```
# Usage
## Require oe-connector
```javascript
const oe = require('@groupclaes/oe-connector')
```

## Running procedures
```javascript
// be sure to call oe.configure() or set env vars before running procedures

/** Standard call without parameters or config */
or.run('getStats')

/** Standard call with parameters */
oe.run('wsv1CheckVat', [
    "0413970957",
    "GRO",
    "MAC,BRA",
    true,
    undefined
  ])

/** Standard call with parameters and options */
oe.run('wsv1CheckVat', [
    "0413970957",
    "GRO",
    "MAC,BRA",
    true,
    undefined
  ], {
    tw: 500,
    c: false,
  })
```

## Configuration
Configuration can be done through 2 different methods: at runtime in code or by using env vars

```javascript
// configure oe-connector the js-way
oe.configure({
  username: 'username', // username for oe-connector
  password: 'password', // password for oe-connector
  host: 'localhost', // oe-connector host must be a valid FQDN or hostname
  port: 5000, // port number
  tw: 60000, // time window in miliseconds
  c: false, // cache enabled
  ct: 3600000, // cache time in miliseconds
  parameterDefaults: {
    in: string,
    out: json
  }
})
```
```javascript
// configure oe-connector with env vars
export OE_USERNAME=username
export OE_PASSWORD=password
export OE_HOST=localhost
export OE_PORT=5000
export OE_TIMEWINDOW=60000
export OE_PARAMDEF_IN=string
export OE_PARAMDEF_OUT=json
```
__note:__ Both configuration methods work interchangably with each other but vars set in env are allways used as fallback meaning vars set in configure() will have priority above env vars.
# Docs

# FAQ

# Credits
License under the [MIT](./license.txt) license