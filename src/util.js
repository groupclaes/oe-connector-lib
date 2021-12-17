// Copyright 2021-2021 Jamie Vangeysel
'use strict'

const validators = require('./validators')

module.exports = (function () {
  /**
   * Retrieves value from environment variable if set, otherwise return defaultValue
   * @param {string} name of the environmnet variable 
   * @param {any} defaultValue which should be used if variable is not set
   * @returns 
   */
  const getEnvVariable = function (name, defaultValue) {
    if (!validators.isUndefined(name)) {
      if (validators.isString(name)) {
        const value = process.env[name]
        return validators.isString(value) ? value : defaultValue
      }
      throw new Error('Name must be a string!')
    }
    throw new Error('Name must be supplied!')
  }

  return {
    getEnvVariable
  }
})()