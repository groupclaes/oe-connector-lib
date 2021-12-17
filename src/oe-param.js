// Copyright 2021-2021 Jamie Vangeysel
'use strict'

const validators = require('./validators')

/**
 * 
 */
module.exports = (function () {
  /**
   * Returns array of valid procedure parameters
   * @param {any[]} parameters of the procedure
   * @param {any} configuration
   * @returns factory of valid procedure parameters
   */
  const buildParameters = function (parameters, configuration) {
    if (!validators.isArray(parameters))
      throw new Error('parameters must be an array!')
    
    const parameterResult = []

    for (const [i, param] of parameters.entries()) {
      if (param === undefined) {
        parameterResult.push(
          getOutputParameter(i + 1, configuration)
        )
      } else {
        parameterResult.push(
          getInputParameter(i + 1, param, configuration)
        )
      }
    }

    return parameterResult
  }

  /**
   * Return the output parameter object
   * @param {number} index position of the parameter
   * @param {any} configuration
   * @returns output parameter object
   */
  const getOutputParameter = function (index, configuration) {
    return {
      pos: index,
      out: true
    }
  }

  /**
   * Return the input parameter object for value
   * @param {number} index position of the parameter
   * @param {any} parameter value
   * @param {any} configuration
   * @returns input parameter object
   */
  const getInputParameter = function (index, param, configuration) {
    const parameter = {
      pos: index,
      value: param,
      type: resolveParameterType(param, configuration)
    }

    if (!parameter.type) {
      delete parameter.type
    }

    return parameter
  }

  /**
   * return the type of parameter supplied as input, if default return undefined
   * number should be 'integer' and object should be 'json'
   * @param {any} param 
   * @param {any} configuration
   * @returns {string} return the type of the parameter
   */
  const resolveParameterType = function (param, configuration) {
    const paramType = typeof param
    switch (paramType) {
      case configuration.parameterDefaults.in:
        return

      case 'number':
        return 'integer'

      case 'object':
        return 'json'
    }
    return paramType
  }

  return {
    build: buildParameters
  }
})()