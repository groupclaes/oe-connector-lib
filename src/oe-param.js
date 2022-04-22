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
    parameterResult.push(getAdvancedParameter(i + 1, param, configuration))
  }

  return parameterResult
}

/**
 * Retrieve either advanced parameter result
 * @param {Number} index 
 * @param {Object} parameter 
 * @param {Object} configuration 
 * @returns a parameter object in OE-connector format
 */
function getAdvancedParameter(index, parameter, configuration) {
  if (parameter?.out) {
    return getAdvancedOutputParameter(index, parameter, configuration)
  } else {
    return parameter.value === undefined ?
        getAdvancedOutputParameter(index, parameter, configuration) :
        getAdvancedInputParameter(index, parameter, configuration)
  }
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

    handleParameterFinalType(parameter)
  } else {
    delete parameter.type
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
    type: resolveParameterType(param, configuration)
  }

  handleParameterFinalType(parameter)

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

  handleParameterFinalType(parameter)

  if (param.redact) {
    parameter.redact = !!param.redact
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
        return 'def'

      break
    case 'number':
      return 'integer'

    case 'object':
      return getOutputObjectParameterType(configuration, isOutParameter)
  }
  return paramType
}

/**
 * Unset/delete the parameter type property if it is null, false or def (default)
 * @param {*} parameter 
 */
function handleParameterFinalType(parameter) {
  if (!parameter.type || parameter.type === 'def') {
    delete parameter.type
  }
}

/**
 * Retrieve the output parameter type if the parameter type is an object
 * @param {*} configuration 
 * @param {*} isOutParameter 
 * @returns either 'json' or 'def' if json is the default configured output type
 */
function getOutputObjectParameterType(configuration, isOutParameter) {
  if (isOutParameter && configuration.parameterDefaults.out === 'json') {
    return 'def'
  }

  return 'json'
}

module.exports = {
  build,
  buildAdvanced
}

if (process.env.NODE_ENV === 'test') {
  module.exports.getInputParameter = getInputParameter
  module.exports.getAdvancedInputParameter = getAdvancedInputParameter
  module.exports.getOutputParameter = getOutputParameter
  module.exports.getAdvancedOutputParameter = getAdvancedOutputParameter
}
