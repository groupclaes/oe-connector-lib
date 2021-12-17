// Copyright 2021-2021 Jamie Vangeysel
'use strict'

module.exports = class Validators {
  static isString = (value) => typeof value === 'string'
  static isNumber = (value) => typeof value === 'number'
  static isBoolean = (value) => typeof value === 'boolean'
  static isObject = (value) => typeof value === 'object'
  static isNull = (value) => value === null
  static isUndefined = (value) => value === undefined
  static isArray = (value) => value && Array.isArray(value)
  static isBetween = (value, min, max) => value >= min && value <= max
  static isNotBetween = (value, min, max) => value < min || value > max
}