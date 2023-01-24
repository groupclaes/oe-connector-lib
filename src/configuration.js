// Copyright 2021-2022 Jamie Vangeysel
'use strict'

const util = require('./util')
const Validators = require('./validators')

module.exports = class Configuration {
  _conf

  constructor() {
    this._conf = {
      username: util.getEnvVariable('OE_USERNAME'),
      password: util.getEnvVariable('OE_PASSWORD'),
      app: util.getEnvVariable('OE_APP'),
      host: util.getEnvVariable('OE_HOST', 'localhost'),
      ssl: util.getEnvVariable('OE_SSL', false, 'boolean'),
      port: util.getEnvVariable('OE_PORT', 5000, 'number'),
      tw: util.getEnvVariable('OE_TIMEWINDOW', 60000, 'number'),
      c: util.getEnvVariable('OE_CACHE', false, 'boolean'),
      ct: util.getEnvVariable('OE_CAHCETIME', 3600000, 'number'),
      simpleParameters: util.getEnvVariable('OE_SIMPLEPARAM', false, 'boolean'),
      parameterDefaults: {
        in: util.getEnvVariable('OE_PARAMDEF_IN', 'string'),
        out: util.getEnvVariable('OE_PARAMDEF_OUT', 'json')
      }
    }
  }

  /**
   * configure
   * @param {any} options
   */
  configure(options) {
    this.validateOptionsParam(options)

    // validate parameters if valid & defined => apply them
    this.configureUsername(options.username)
    this.configurePassword(options.password)
    this.configureApp(options.app)
    this.configureHost(options.host)
    this.configureSsl(options.ssl)
    this.configurePort(options.port)
    this.configureTimeWindow(options.tw)
    this.configureCacheEnabled(options.c)
    this.configureCacheTime(options.ct)
    this.configureSimpleParameters(options.simpleParameters)
  }

  /**
   * Configure username
   * @param {string | undefined} username
   */
  configureUsername(username) {
    if (!Validators.isUndefined(username)) {
      this.configureStringIfMatches(username, 'username', '^[a-zA-Z0-9-_]{1,32}$', 'only letters, numbers, dashes and underscores with a max length of 32 characters')
    }
  }

  /**
   * Configure password
   * @param {string | undefined} password
   */
  configurePassword(password) {
    if (!Validators.isUndefined(password)) {
      this.configureStringIfMatches(password, 'password', '^[a-zA-Z0-9-_@$!%*#?&]{1,32}$', 'only letters, numbers, dashes, underscores or any of the following characters: @$!%*#?& with a max length of 32 characters')
    }
  }
  /**
   * Configure username
   * @param {string | undefined} username
   */
  configureApp(app) {
    if (!Validators.isUndefined(app)) {
      this.configureStringIfMatches(app, 'app', '^[a-zA-Z0-9-_]{1,32}$', 'only letters, numbers, dashes and underscores with a max length of 32 characters')
    }
  }

  /**
   * Configure host
   * @param {string | undefined} host
   */
  configureHost(host) {
    if (!Validators.isUndefined(host)) {
      this.configureStringIfMatches(host, 'host', /^(?!:\/\/)(?!.{256,})(([a-z0-9][a-z0-9_-]*?)|([a-z0-9][a-z0-9_-]*?\.)+?[a-z]{2,6}?)$/i, 'valid FQDN or hostname')
    }
  }

  /**
   * Configure ssl
   * @param {boolean | undefined} ssl
   */
  configureSsl(ssl) {
    if (!Validators.isUndefined(ssl)) {
      this.configureBoolean(ssl, 'ssl')
    }
  }

  /**
   * Configure port
   * @param {number | undefined} port
   */
  configurePort(port) {
    if (!Validators.isUndefined(port)) {
      this.configureNumberIfBetween(port, 'port', 1, 65535)
    }
  }

  /**
   * Configure timeWindow
   * @param {number | undefined} timeWindow
   */
  configureTimeWindow(timeWindow) {
    if (!Validators.isUndefined(timeWindow)) {
      this.configureNumberIfBetween(timeWindow, 'tw', -1, 300000)
    }
  }

  /**
   * Configure cacheEnabled
   * @param {boolean | undefined} cacheEnabled
   */
  configureCacheEnabled(cacheEnabled) {
    if (!Validators.isUndefined(cacheEnabled)) {
      this.configureBoolean(cacheEnabled, 'c')
    }
  }

  /**
   * Configure cacheTime
   * @param {number | undefined} cacheTime
   */
  configureCacheTime(cacheTime) {
    if (!Validators.isUndefined(cacheTime)) {
      this.configureNumberIfBetween(cacheTime, 'ct', -1, 86400000)
    }
  }

  /**
   * Configure simpleParameters
   * @param {boolean | undefined} simpleParameters
   */
  configureSimpleParameters(simpleParameters) {
    if (!Validators.isUndefined(simpleParameters)) {
      this.configureBoolean(simpleParameters, 'simpleParameters')
    }
  }

  /**
   * Build config for request
   *
   * @param {*} options parsed to the request
   * @return {any} configuration object to supply with payload 
   */
  build(options) {
    let configuration = {
      ...this.configuration,
      ...options,
    }
    if (options && options.parameterDefaults) {
      configuration.parameterDefaults = {
        ...this.configuration.parameterDefaults,
        ...options.parameterDefaults
      }
    }

    if (!configuration.creds && ((this.configuration.username && this.configuration.password) || this.configuration.app)) {
      configuration = this.configureCredentials(configuration)
    }

    delete configuration.username
    delete configuration.password
    delete configuration.app

    return configuration
  }

  configureCredentials(configuration) {
    configuration.creds = {}

    if (configuration.username && configuration.password) {
      configuration.creds.user = configuration.username
      configuration.creds.pwd = configuration.password
    }
    if (configuration.app) {
      configuration.creds.app = configuration.app
    }
    return configuration
  }

  get configuration() {
    return this._conf
  }

  set configuration(value) {
    this._conf = value
  }


  /**
   * Validate option parameter
   * @private
   * @param {any} options 
   */
  validateOptionsParam(options) {
    if (Validators.isUndefined(options))
      throw new Error('No Options supplied!')
    else if (Validators.isNull(options))
      throw new Error('Options must not be null!')
    else if (!Validators.isObject(options))
      throw new Error('Options must be an object!')
    else if (Validators.isArray(options))
      throw new Error('Options must not be an array!')
    else if (Object.keys(options).length === 0)
      throw new Error('Options object must contain at least one property!')
  }

  /**
   * Set configuration if string matches regexp
   * @private
   * @param {string} value to configure
   * @param {string} name of the option 
   * @param {string} regexp to match
   */
  configureStringIfMatches(value, option, regexp, reason) {
    if (!Validators.isString(value))
      throw new Error(`${option} must be a string!`)
    if (!value.match(regexp))
      throw new Error(`${option} is invalid and should match ${reason}!`)

    this._conf[option] = value
  }

  /**
   * Set configuration if number and between min and max param
   * @private
   * @param {number} value to configure
   * @param {string} name of the option 
   * @param {number} min value number
   * @param {number} max  value number
   */
  configureNumberIfBetween(value, option, min, max) {
    if (!Validators.isNumber(value))
      throw new Error(`${option} must be a number!`)

    const number = parseInt(value, 10)
    if (Validators.isNotBetween(number, min, max))
      throw new Error(`${option} must be between ${min} and ${max}!`)

    this._conf[option] = number
  }

  configureBoolean(value, option) {
    if (!Validators.isBoolean(value))
      throw new Error(`${option} must be a boolean!`)

    this._conf[option] = value
  }
}