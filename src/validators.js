// Copyright 2021-2021 Jamie Vangeysel
'use strict'

module.exports = (function () {
  const isString = (value) => typeof value === 'string'
  const isObject = (value) => typeof value === 'object'
  const isNull = (value) => value === null
  const isUndefined = (value) => value === undefined
  const isArray = (value) => value && Array.isArray(value)

  return {
    isNull,
    isUndefined,
    isArray,
    isObject,
    isString
  }
})()