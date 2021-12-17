// Copyright 2021-2021 Jamie Vangeysel
'use strict'

const util = require('./util')
const Validators = require('./validators')

module.exports = class Configuration {
  _conf = {
    username: util.getEnvVariable('OE_USERNAME'),
    password: util.getEnvVariable('OE_PASSWORD'),
    host: util.getEnvVariable('OE_HOST', 'localhost'),
    port: util.getEnvVariable('OE_PORT', 5000),
    tw: util.getEnvVariable('OE_TIMEWINDOW', 60000),
    c: util.getEnvVariable('OE_CACHE', false),
    ct: util.getEnvVariable('OE_CAHCETIME', 3600000),
    parameterDefaults: {
      in: util.getEnvVariable('OE_PARAMDEF_IN', 'string'),
      out: util.getEnvVariable('OE_PARAMDEF_OUT', 'json')
    }
  }

  constructor() {

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
    this.configureHost(options.host)
    this.configurePort(options.port)
    this.configureTimeWindow(options.tw)
    this.configureCacheEnabled(options.c)
    this.configureCacheTime(options.ct)
  }

  /**
   * Configure username
   * @param {string | undefined} username
   */
  configureUsername(username) {
    if (!Validators.isUndefined(username)) {
      if (!Validators.isString(username))
        throw new Error('Username must be a string!')
      if (!username.match('^[a-zA-Z0-9-_]{1,255}$'))
        throw new Error('Username must contain only letters, numbers, dashes and underscores with a max length of 255 characters!')

      this._conf.username = username
    }
  }

  /**
   * Configure password
   * @param {string | undefined} password
   */
  configurePassword(password) {
    if (!Validators.isUndefined(password)) {
      if (!Validators.isString(password))
        throw new Error('Password must be a string!')
      if (!password.match('^[a-zA-Z0-9-_@$!%*#?&]{1,255}$'))
        throw new Error('Password must contain only letters, numbers, dashes, underscores or any of the following characters: @$!%*#?& with a max length of 255 characters!')

      this._conf.password = password
    }
  }

  /**
   * Configure host
   * @param {string | undefined} host
   */
  configureHost(host) {
    if (!Validators.isUndefined(host)) {
      if (!Validators.isString(host))
        throw new Error('Host must be a string!')
      if (!host.match(/^(?!:\/\/)(?!.{256,})(([a-z0-9][a-z0-9_-]*?)|([a-z0-9][a-z0-9_-]*?\.)+?[a-z]{2,6}?)$/i))
        throw new Error('Host is invalid should be a valid FQDN or Hostname!')

      this._conf.host = host
    }
  }

  /**
   * Configure port
   * @param {number | undefined} port
   */
  configurePort(port) {
    if (!Validators.isUndefined(port)) {
      if (!Validators.isNumber(port))
        throw new Error('Port must be a number!')

      const number = parseInt(port, 10)
      if (number < 1 || number > 65535)
        throw new Error('Port must be between 1 and 65535!')

      this._conf.port = number
    }
  }

  /**
   * Configure timeWindow
   * @param {number | undefined} timeWindow
   */
  configureTimeWindow(timeWindow) {
    if (!Validators.isUndefined(timeWindow)) {
      if (!Validators.isNumber(timeWindow))
        throw new Error('TimeWindow must be a number!')

      const number = parseInt(timeWindow, 10)
      if (number < 100 || number > 300000)
        throw new Error('TimeWindow must be between 100 and 300000!')

      this._conf.tw = number
    }
  }

  /**
   * Configure cacheEnabled
   * @param {boolean | undefined} cacheEnabled
   */
  configureCacheEnabled(cacheEnabled) {
    if (!Validators.isUndefined(cacheEnabled)) {
      if (!Validators.isBoolean(cacheEnabled))
        throw new Error('CacheEnabled must be a boolean!')

      this._conf.c = cacheEnabled === true
    }
  }

  /**
   * Configure cacheTime
   * @param {number | undefined} cacheTime
   */
  configureCacheTime(cacheTime) {
    if (!Validators.isUndefined(cacheTime)) {
      if (!Validators.isNumber(cacheTime))
        throw new Error('CacheTime must be a number!')

      const number = parseInt(cacheTime, 10)
      if (number < 60000 || number > 86400000)
        throw new Error('CacheTime must be between 60000 and 86400000!')

      this._conf.ct = number
    }
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
    if (Validators.isNull(options))
      throw new Error('Options must not be null!')
    if (!Validators.isObject(options))
      throw new Error('Options must be an object!')
    if (Validators.isArray(options))
      throw new Error('Options must not be an array!')
    if (Object.keys(options).length === 0)
      throw new Error('Options object must contain at least one property!')
  }
}