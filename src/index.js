// Copyright 2021-2021 Jamie Vangeysel
'use strict'

const validators = require('./validators')
const param = require('./oe-param')
const Configuration = require('./configuration')

const config = new Configuration()

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

    let req = buildWebRequest(data.length, resolve)

    req.on('error', error => {
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
  if (!name.match(/^(([\w- ]{1,223}\/)*)([\w-. ]{1,32})$/))
    throw new Error('Name is invalid, should only contain letters, numbers or special characters: -._ or a space (path is optional)!')
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

function buildWebRequest(dataLength, resolve) {
  const requestOptions = buildWebRequestOptions(dataLength)

  // use http or https depending on configuration
  const webhost = config.configuration.ssl === true ? require('https') : require('http')

  return webhost.request(requestOptions, (res) => {
    let body
    res.on('data', buffer => {
      if (!body) {
        body = ''
      }
      body += buffer
    })
    res.on('end', _ => {
      resolve(body && typeof body === 'string' ? JSON.parse(body) : body)
      // do cleanup after resolve
      body = null
      res = null
    })
  })
}

/**
 * @private buildRequest
 * @param {string} name
 * @param {any[]} parameters
 * @param {any} options
 * @returns {any} payload to post to oe-connector
 */
function buildRequest(name, parameters, options) {
  const configuration = config.build(options)

  const payload = {
    proc: name.indexOf('.') > -1 ? name : `${name}.p`,
    parm: [],
    tw: configuration.tw,
    cache: configuration.c === true ? configuration.ct : -1,
  }

  const buildParam = param.build(parameters, configuration)
  if (buildParam) {
    payload.parm = buildParam
  }

  if (configuration.creds) {
    payload.creds = configuration.creds
  }

  return payload
}

function configure(options) {
  config.configure(options)
}

module.exports = {
  run,
  configure,
  configuration: config.configuration,
  test: buildRequest
}