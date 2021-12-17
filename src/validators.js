// Copyright 2021-2021 Jamie Vangeysel
'use strict'

export class Validators {
  isString = (value) => typeof value === 'string'
  isObject = (value) => typeof value === 'object'
  isNull = (value) => value === null
  isUndefined = (value) => value === undefined
  isArray = (value) => value && Array.isArray(value)
}