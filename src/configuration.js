// Copyright 2021-2021 Jamie Vangeysel
'use strict'

const util = require('./util')

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

  get configuration() {
    return this._conf
  }

  set configuration(value) {
    this._conf = value
  }
}