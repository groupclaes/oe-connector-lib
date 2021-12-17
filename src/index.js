// Copyright 2021-2021 Jamie Vangeysel
'use strict'

const http = require('http')
const validators = require('./validators')
const param = require('./oe-param')
const Configuration = require('./configuration')

/**
 * run
 * @param {string} name name of the procedure to be run
 * @param {any[]} parameters provide an empty array when no parameters should be supplied
 * @param {any} options
 * @returns {Promise<any>} return Promise resolved with result from oe-connector
 */
function run(name, parameters, options) {
  validateRunParam(name, parameters)

  const request = buildRequest(name, parameters, options)

  // wrap http request in promise chain
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(request)

    let req = buildWebRequest(data.length, resolve, reject)

    req.on('error', error => {
      console.error(error)
      reject(error)
    })

    req.write(data)
    req.end()
  })
}

function validateRunParam(name, parameters) {
  validateNameParam(name)
  validateParametersParam(parameters)
}

function validateNameParam(name) {
  if (validators.isUndefined(name))
    throw new Error('No name supplied!')
  if (validators.isNull(name))
    throw new Error('name must not be null!')
  if (!validators.isString(name))
    throw new Error('name must be a string!')
  if (!name.match(/^[\w\-. ]+$/))
    throw new Error('Name is invalid, should only contain letters, numbers or special characters: -._ or a space!')
}

function validateParametersParam(parameters) {
  if (validators.isUndefined(parameters))
    throw new Error('No parameters supplied!')
  if (validators.isNull(parameters))
    throw new Error('parameters must not be null!')
  if (!validators.isObject(parameters))
    throw new Error('parameters must be an object (Array)!')
  if (!validators.isArray(parameters))
    throw new Error('parameters must be an array!')
}

function validateOptionsParam(options) {
  if (validators.isUndefined(options))
    throw new Error('No Options supplied!')
  if (validators.isNull(options))
    throw new Error('Options must not be null!')
  if (!validators.isObject(options))
    throw new Error('Options must be an object!')
  if (validators.isArray(options))
    throw new Error('Options must not be an array!')
  if (Object.keys(options).length === 0)
    throw new Error('Options object must contain at least one property!')
}

/**
 * Build options object to use for the http(s) request
 * @param {number} dataLength: length of the data to post 
 * @returns {any} options object fot http(s) request
 */
function buildWebRequestOptions(dataLength) {
  return {
    hostname: config.configuration.host,
    port: config.configuration.port,
    path: '/api/openedge',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': dataLength
    }
  }
}

function buildWebRequest(dataLength, resolve, reject) {
  try {
    const requestOptions = buildWebRequestOptions(dataLength)

    return http.request(requestOptions, (res) => {
      let body = ''

      res.on('data', buffer => {
        body += buffer
      })

      res.on('end', _ => {
        try {
          if (body && typeof body === 'string') {
            resolve(JSON.parse(body))
            return
          }
          resolve(body)
        } catch (err) {
          resolve(body)
        } finally {
          // do cleanup after resolve
          body = null
          res = null
        }
      })
    })
  } catch (err) {
    reject(err)
  }
}

/**
 * configure
 * @param {any} options 
 */
function configure(options) {
  validateOptionsParam(options)

  // validate parameters if not undefined and apply them
  if (options.username !== undefined) {
    if (typeof options.username === 'string') {
      if (options.username.match('^[a-zA-Z0-9-_]{1,255}$')) {
        config.configuration.username = options.username
      } else {
        throw new Error('Username must contain only letters, numbers, dashes and underscores with a max length of 255 characters!')
      }
    } else {
      throw new Error('options.username must be a string!')
    }
  }

  if (options.password !== undefined) {
    if (typeof options.password === 'string') {
      if (options.password.match('^[a-zA-Z0-9-_@$!%*#?&]{1,255}$')) {
        config.configuration.password = options.password
      } else {
        throw new Error('Password must contain only letters, numbers, dashes, underscores or any of the following characters: @$!%*#?& with a max length of 255 characters!')
      }
    } else {
      throw new Error('options.password must be a string!')
    }
  }

  if (options.host !== undefined) {
    if (typeof options.host === 'string') {
      if (options.host.match(/^(?!:\/\/)(?!.{256,})(([a-z0-9][a-z0-9_-]*?)|([a-z0-9][a-z0-9_-]*?\.)+?[a-z]{2,6}?)$/i)) {
        config.configuration.host = options.host
      } else {
        throw new Error('options.host is invalid should be a valid FQDN or Hostname!')
      }
    } else {
      throw new Error('options.host must be a string!')
    }
  }

  if (options.port !== undefined) {
    if (typeof options.port === 'number') {
      const number = parseInt(options.port, 10)
      if (number > 0 && number <= 65535) {
        config.configuration.port = number
      } else {
        throw new Error('options.port must be between 1 and 65535!')
      }
    } else {
      throw new Error('options.port must be a number!')
    }
  }

  if (options.tw !== undefined) {
    if (typeof options.tw === 'number') {
      const number = parseInt(options.tw, 10)
      if (number >= 100 && number <= 300000) {
        config.configuration.tw = number
      } else {
        // range between 100ms and 5m
        throw new Error('options.tw must be between 100 and 300000!')
      }
    } else {
      throw new Error('options.tw must be a number!')
    }
  }

  if (options.c !== undefined) {
    if (typeof options.c === 'boolean') {
      config.configuration.c = options.c === true
    } else {
      throw new Error('options.c must be a boolean!')
    }
  }

  if (options.ct !== undefined) {
    if (typeof options.ct === 'number') {
      const number = parseInt(options.ct, 10)
      if (number >= 60000 && number <= 86400000) {
        config.configuration.ct = number
      } else {
        // range between 1m and 24h
        throw new Error('options.ct must be between 60000 and 86400000!')
      }
    } else {
      throw new Error('options.ct must be a number!')
    }
  }
}

/**
 * @private buildRequest
 * @param {string} name
 * @param {any[]} parameters
 * @param {any} options
 * @returns {any} payload to post to oe-connector
 */
function buildRequest(name, parameters, options) {
  const configuration = {
    ...config.configuration,
    ...options
  }

  if (name == 'testProcedure')
  console.log(config.configuration, options, configuration)

  const payload = {
    proc: name.indexOf('.') > -1 ? name : `${name}.p`,
    parm: [],
    tw: configuration.tw,
    cache: configuration.c === true ? configuration.ct : -1
  }

  const buildParam = param.build(parameters, configuration)
  if (buildParam) {
    payload.parm = buildParam
  }

  return payload
}

const config = new Configuration()

module.exports = {
  run,
  configure,
  configuration: config.configuration,
  test: buildRequest
}