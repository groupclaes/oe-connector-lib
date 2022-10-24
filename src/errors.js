// Copyright 2021-2022 Jamie Vangeysel
'use strict'

class ProcedureNameInvalidError extends Error {
  constructor(type) {
    super(ProcedureNameInvalidErrorMessage[type] ?? 'ProcedureNameInvalidError')
  }
}

class ProcedureParametersInvalidError extends Error {
  constructor(type) {
    super(ProcedureParametersInvalidErrorMessage[type] ?? 'ProcedureParametersInvalidError')
  }
}

const ProcedureNameInvalidErrorMessage = {
  'isUndefined': 'ProcedureName is undefined!',
  'isNull': 'ProcedureName is null!',
  'isNotString': 'ProcedureName should be a string!',
  'isNotMatch': 'ProcedureName did not match valid pettern: only letters, numbers, special characters: /-._ or a space are allowed!',
}

const ProcedureParametersInvalidErrorMessage = {
  'isUndefined': 'ProcedureParameters is undefined',
  'isNull': 'ProcedureParameters is null!',
  'isNotObject': 'ProcedureParameters should be an object (Type: Array)!',
  'isNotArray': 'ProcedureParameters must be an Array!',
}

module.exports = {
  ProcedureNameInvalidError,
  ProcedureParametersInvalidError
}