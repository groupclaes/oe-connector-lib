// Copyright 2021-2021 Jamie Vangeysel
'use strict'

const http = require('http')
const validators = require('./validators')
const param = require('./oe-param')

module.exports = (function () {
  /**
   * run
   * @param {string} name name of the procedure to be run
   * @param {any[]} parameters provide an empty array when no parameters should be supplied
   * @param {any} options
   * @returns {Promise<any>} return Promise resolved with result from oe-connector
   */
  const run = function (name, parameters, options) {
    if (validators.isUndefined(name))
      throw new Error('No name supplied!')
    if (!validators.isString(name) || validators.isNull(name))
      throw new Error('name must be a string and must not be null!')
    if (!name.match(/^[\w\-. ]+$/))
      throw new Error('Name is invalid, should only contain letters, numbers or special characters: -._ or a space!')

    if (validators.isUndefined(parameters))
      throw new Error('No parameters supplied!')
    if (!validators.isObject(parameters) || validators.isNull(parameters))
      throw new Error('parameters must be an object type array and must not be null!')
    if (validators.isArray(parameters))
      throw new Error('parameters must be an array!')

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

  /**
   * Build options object to use for the http(s) request
   * @param {number} dataLength: length of the data to post 
   * @returns {any} options object fot http(s) request
   */
  const buildWebRequestOptions = (dataLength) => {
    return {
      hostname: configuration.host,
      port: configuration.port,
      path: '/api/openedge',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataLength
      }
    }
  }

  const buildWebRequest = (dataLength, resolve, reject) => {
    try {
      const requestOptions = buildWebRequestOptions(
        dataLength
      )

      return http.request(requestOptions, (res) => {
        let body = ''

        res.on('data', buffer => {
          body += buffer
        })

        res.on('end', _ => {
          try {
            if (body && typeof body === 'string') resolve(JSON.parse(body))
            else resolve(body)
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
  const configure = function (options) {
    if (validators.isUndefined(options))
      throw new Error('No Options supplied!')
    if (!validators.isObject(options) || validators.isNull(options))
      throw new Error('Options must be an object and must not be null!')

    if (validators.isArray(options))
      throw new Error('Options must be an object and not an array!')

    // Validate if options is an empty object
    if (Object.keys(options).length === 0)
      throw new Error('Options must contain at least one property!')

    // validate parameters if not undefined and apply them
    if (options.username !== undefined) {
      if (typeof options.username === 'string') {
        if (options.username.match('^[a-zA-Z0-9-_]{1,255}$')) {
          configuration.username = options.username
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
          configuration.password = options.password
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
          configuration.host = options.host
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
          configuration.port = number
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
          configuration.tw = number
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
        configuration.c = options.c === true
      } else {
        throw new Error('options.c must be a boolean!')
      }
    }

    if (options.ct !== undefined) {
      if (typeof options.ct === 'number') {
        const number = parseInt(options.ct, 10)
        if (number >= 60000 && number <= 86400000) {
          configuration.ct = number
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
  const buildRequest = function (name, parameters, options) {
    const config = {
      ...configuration,
      ...options
    }

    const payload = {
      proc: name.indexOf('.') > -1 ? name : `${name}.p`,
      parm: [],
      tw: config.tw,
      cache: config.c === true ? config.ct : -1
    }

    const buildParam = param.build(parameters, configuration)
    if (buildParam) {
      payload.parm = buildParam
    }

    return payload
  }

  /**
   * Retrieves value from environment variable if set, otherwise return defaultValue
   * @param {string} name of the environmnet variable 
   * @param {any} defaultValue which should be used if variable is not set
   * @returns 
   */
  const getEnvVariable = function (name, defaultValue) {
    if (name !== undefined) {
      if (typeof name === 'string') {
        const value = process.env[name]
        if (value) return value
        return defaultValue
      } else {
        throw new Error('name must be a string!')
      }
    } else {
      throw new Error('Name must be supplied!')
    }
  }

  let configuration = {
    username: getEnvVariable('OE_USERNAME'),
    password: getEnvVariable('OE_PASSWORD'),
    host: getEnvVariable('OE_HOST', 'localhost'),
    port: getEnvVariable('OE_PORT', 5000),
    tw: getEnvVariable('OE_TIMEWINDOW', 60000),
    c: getEnvVariable('OE_CACHE', false),
    ct: getEnvVariable('OE_CAHCETIME', 3600000),
    parameterDefaults: {
      in: getEnvVariable('OE_PARAMDEF_IN', 'string'),
      out: getEnvVariable('OE_PARAMDEF_OUT', 'json')
    }
  }

  // Explicitly reveal public pointers to the private functions 
  // that we want to reveal publicly

  return {
    run: run,
    configure: configure,
    configuration: configuration,
    test: buildRequest
  }
})()