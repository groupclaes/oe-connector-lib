// Copyright 2021-2022 Jamie Vangeysel
'use strict'

const validators = require('./validators')

/**
 * Returns array of valid procedure parameters
 * @param {any[]} parameters of the procedure
 * @param {any} configuration
 * @returns factory of valid procedure parameters
 */
function build(parameters, configuration) {
  if (!validators.isArray(parameters))
    throw new Error('parameters must be an array!')

  const parameterResult = []

  for (const [i, param] of parameters.entries()) {
    parameterResult.push(
      param === undefined ?
        getOutputParameter(i + 1, configuration) :
        getInputParameter(i + 1, param, configuration)
    )
  }

  return parameterResult
}

/**
 * Returns array of valid procedure parameters
 * @param {any[]} parameters of the procedure in object format
 * @param {any} configuration
 * @returns factory of valid procedure parameters
 */
function buildAdvanced(parameters, configuration) {
  if (!validators.isArray(parameters))
    throw new Error('parameters must be an array!')

  const parameterResult = []

  for (const [i, param] of parameters.entries()) {
    if (!param) {
      parameterResult.push(getAdvancedOutputParameter(i + 1, param, configuration))
    } else {
      parameterResult.push(
        param.value === undefined ?
          getAdvancedOutputParameter(i + 1, param, configuration) :
          getAdvancedInputParameter(i + 1, param, configuration)
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
function getOutputParameter(index, configuration) {
  if (configuration.parameterDefaults.out === 'json')
    return {
      pos: index,
      out: true
    }
  else
    return {
      pos: index,
      type: configuration.parameterDefaults.out,
      out: true
    }
}

/**
 * Return the output parameter object
 * @param {number} index position of the parameter
 * @param {Object} options Output parameter options
 * @param {any} configuration
 * @returns output parameter object
 */
 function getAdvancedOutputParameter(index, options, configuration) {
  const parameter = {
    pos: index,
    out: true,
  }
  if (options.type != null && options.type !== configuration.parameterDefaults.out) {
    parameter.type = resolveParameterTypeString(options.type, configuration, true)

    if (!parameter.type) {
      delete parameter.type
    }
  }

  if (options.ar) {
    parameter.ar = options.ar
  }

  if (options.label) {
    parameter.label = options.label
  }

  return parameter
}

/**
 * Return the input parameter object for value
 * @param {number} index position of the parameter
 * @param {any} parameter value
 * @param {any} configuration
 * @returns input parameter object
 */
function getInputParameter(index, param, configuration) {
  const parameter = {
    pos: index,
    value: param,
    type: resolveParameterType(param, configuration),
  }

  if (!parameter.type) {
    delete parameter.type
  }

  return parameter
}
/**
 * Return the input parameter object for value
 * @param {number} index position of the parameter
 * @param {any} parameter value
 * @param {any} configuration
 * @returns input parameter object
 */
function getAdvancedInputParameter(index, param, configuration) {
  const parameter = {
    pos: index,
    value: param.value,
    type: resolveParameterTypeString(param.type, configuration) ??
      resolveParameterType(param.value, configuration)
  }

  if (!parameter.type) {
    delete parameter.type
  }

  if (param.redact) {
    parameter.redact = param.redact && true
  }

  if (param.label) {
    parameter.label = param.label
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
function resolveParameterType(param, configuration) {
  if (param === null) return
  const paramType = typeof param

  return resolveParameterTypeString(paramType, configuration)
}
/**
 * return the type of parameter supplied as input, if default return undefined
 * number should be 'integer' and object should be 'json'
 * @param {any} param 
 * @param {any} configuration
 * @param {Boolean} isOutParameter
 * @returns {string} return the type of the parameter
 */
 function resolveParameterTypeString(paramType, configuration, isOutParameter) {
  switch (paramType) {
    case configuration.parameterDefaults.in:
      if (!isOutParameter)
        return false
        
      break

    case configuration.parameterDefaults.out:
      if (isOutParameter)
        return false

      break

    case 'number':
      return 'integer'

    case 'object':
      if (isOutParameter) {
        return
      } else {
        return 'json'
      }
  }
  return paramType
}

module.exports = {
  build,
  buildAdvanced,
  getInputParameter,
  getAdvancedInputParameter,
  getOutputParameter,
  getAdvancedOutputParameter,
  resolveParameterType
}
