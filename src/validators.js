// Copyright 2021-2021 Jamie Vangeysel
'use strict'

class Validators {
  static isString = (value) => typeof value === 'string'
  static isObject = (value) => typeof value === 'object'
  static isNull = (value) => value === null
  static isUndefined = (value) => value === undefined
  static isArray = (value) => value && Array.isArray(value)
}

module.exports = {
  Validators
}