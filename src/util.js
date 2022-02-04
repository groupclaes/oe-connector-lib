// Copyright 2021-2022 Jamie Vangeysel
'use strict'

const validators = require('./validators')

/**
 * Retrieves value from environment variable if set, otherwise return defaultValue
 * @param {string} name of the environmnet variable 
 * @param {any} defaultValue which should be used if variable is not set
 * @returns 
 */
function getEnvVariable(name, defaultValue, type) {
  if (validators.isUndefined(name))
    throw new Error('Name must be supplied!')
  if (!validators.isString(name))
    throw new Error('Name must be a string!')

  switch (type) {
    case 'boolean':
      return process.env[name] === 'true' || defaultValue
    case 'number':
      return parseInt(process.env[name], 10) || defaultValue
  }
  return process.env[name] || defaultValue
}

module.exports = {
  getEnvVariable
}