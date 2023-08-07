// Copyright 2021-2022 Jamie Vangeysel
'use strict'

const validators = require('./validators')
const param = require('./oe-param')
const Configuration = require('./configuration')
const {
  ProcedureNameInvalidError,
  ProcedureParametersInvalidError
} = require('./errors')

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
  const configuration = config.build(options)

  const request = buildRequest(name, parameters, configuration)

  // wrap http request in promise chain
  return new Promise((resolve, reject) => {
    const buff = Buffer.from(JSON.stringify(request), 'utf8')

    let req = buildWebRequest(resolve, configuration)

    req.on('error', error => {
      reject(error)
    })

    req.write(buff)
    req.end()
  })
}

function validateRunParam(name, parameters) {
  validateNameParam(name)
  validateParametersParam(parameters)
}

function validateNameParam(name) {
  if (validators.isUndefined(name))
    throw new ProcedureNameInvalidError('isUndefined')
  if (validators.isNull(name))
    throw new ProcedureNameInvalidError('isNull')
  if (!validators.isString(name))
    throw new ProcedureNameInvalidError('isNotString')
  if (!name.match(/^(([\w- ]{1,223}\/)*)([\w-. ]{1,32})$/))
    throw new ProcedureNameInvalidError('isNotMatch')
}

function validateParametersParam(parameters) {
  if (validators.isUndefined(parameters))
    throw new ProcedureParametersInvalidError('isUndefined')
  if (validators.isNull(parameters))
    throw new ProcedureParametersInvalidError('isNull')
  if (!validators.isObject(parameters))
    throw new ProcedureParametersInvalidError('isNotObject')
  if (!validators.isArray(parameters))
    throw new ProcedureParametersInvalidError('isNotArray')
}

/**
 * Build options object to use for the http(s) request
 * @param {number} dataLength: length of the data to post 
 * @returns {any} options object fot http(s) request
 */
function buildWebRequestOptions(configuration) {
  return {
    hostname: configuration.host,
    port: configuration.port,
    path: '/api/openedge',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
}

function buildWebRequest(resolve, configuration) {
  const requestOptions = buildWebRequestOptions(configuration)

  // use http or https depending on configuration
  const webhost = configuration.ssl === true ? require('https') : require('http')

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
 * @param {any} configuration
 * @returns {any} payload to post to oe-connector
 */
function buildRequest(name, parameters, configuration) {
  const payload = {
    proc: getProcedureName(name),
    parm: []
  }
  configuration = config.build(configuration)

  if (configuration.tw)
    payload.tw = configuration.tw
  
  if (configuration.c === true)
    payload.cache = configuration.c === true ? configuration.ct : -1

  payload.parm = getParameters(parameters, configuration)

  if (configuration.creds)
    payload.creds = configuration.creds

  return payload
}

/**
 * Returns name of procedure to run, append missing .p if applicable
 * @private
 * @param {string} name
 * @returns {string} procedure filename
 */
function getProcedureName(name) {
  if (name.indexOf('.') > -1)
    return name
  return name + '.p'
}

/**
 * Returns build parameters array from input
 * @private
 * @param {any[]} parameters to compile 
 * @returns {any[]} build parameters array
 */
function getParameters(parameters, configuration) {
  let buildParam

  if (configuration.simpleParameters === false)
    buildParam = param.buildAdvanced(parameters, configuration)
  else
    buildParam = param.build(parameters, configuration)

  return buildParam
}

function configure(options) {
  return config.configure(options)
}

module.exports = {
  run,
  configure,
  configuration: config.configuration,
  test: buildRequest
}