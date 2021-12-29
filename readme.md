[![Build Status](https://api.travis-ci.com/groupclaes/oe-connector-lib.svg?token=tpEYPD8CxWfr1dytjAz7&branch=master)](https://travis-ci.com/groupclaes/oe-connector-lib) [![Maintainability](https://api.codeclimate.com/v1/badges/d395b0d52f2953f97b6f/maintainability)](https://codeclimate.com/github/groupclaes/oe-connector-lib/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/d395b0d52f2953f97b6f/test_coverage)](https://codeclimate.com/github/groupclaes/oe-connector-lib/test_coverage) [![Known Vulnerabilities](https://snyk.io/test/github/groupclaes/oe-connector-lib/badge.svg)](https://snyk.io/test/github/groupclaes/oe-connector-lib)  ![version](https://img.shields.io/badge/version-1.0.5-blue)  

<!-- [![depenencies](https://status.david-dm.org/gh/groupclaes/oe-connector-lib.svg)](https://david-dm.org/groupclaes/oe-connector-lib) [![devDepenencies](https://status.david-dm.org/gh/groupclaes/oe-connector-lib.svg?type=dev)](https://david-dm.org/groupclaes/oe-connector-lib?type=dev) -->

**OE-Connector Library**

# Index
- [Index](#index)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Require oe-connector](#require-oe-connector)
  - [Running procedures](#running-procedures)
  - [Configuration](#configuration)
- [Docs](#docs)
- [Credits](#credits)

# Prerequisites
In order to use this package you will need to have an instance of the [oe-connector](https://github.com/groupclaes/oe-connector) running. This library has been designed to work specifically and only with our in-house developed [oe-connector](https://github.com/groupclaes/oe-connector).  
  
The connector has been verified to work with OpenEdge version 11.6 and will propbably work with all next version we have not tested this on versions 12 and above.

Please note that this library will require an http connection to the [oe-connector](https://github.com/groupclaes/oe-connector) and thus data between the server and the client will be unencrypted.

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

/** Run procedure without parameters or config */
or.run('getStats')

/** Run procedure testProcedure with parameters */
oe.run('testProcedure', [
    "string parameter",
    true,
    undefined
  ])

/** Run procedure testProcedure with parameters and options */
oe.run('testProcedure', [
    "string parameter",
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
  ssl: true, // use SSL to connect to host
  port: 5000, // port number
  tw: 60000, // time window in miliseconds
  c: false, // cache enabled
  ct: 3600000, // cache time in miliseconds
  parameterDefaults: { // there must reflect the default parameters in the oe-connector
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
export OE_SSL=true
export OE_PORT=5000
export OE_TIMEWINDOW=60000
export OE_PARAMDEF_IN=string
export OE_PARAMDEF_OUT=json
```
__Note:__ Both configuration methods work interchangably with each other but vars set in env are allways used as fallback meaning vars set in configure() will have priority above env vars.
# Docs

Documentation is coming later with release version 1.1
<!-- # FAQ

NO FAQ's at the moment -->

# Credits
License under the [MIT](./license.txt) license  
Huge thanks to [Thibaut Nijs](https://github.com/FlyingWraptor) for providing [oe-connector](https://github.com/groupclaes/oe-connector)