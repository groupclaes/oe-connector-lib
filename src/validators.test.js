const Validators = require('./validators')
const { describe, expect, test } = require('@jest/globals')

describe('Validators', () => {
  describe('isUndefined()', () => {
    test('Should return true when testing undefined', () => {
      expect(Validators.isUndefined(undefined)).toBe(true)
    })
  
    const cases = [ [null], [0], [true], [false], ['foo'], [{}], [[]] ]
    test.each(cases)('Should return false when providing %s argument', (argument) => {
      expect(Validators.isUndefined(argument)).toBe(false)
    })
  })

  describe('isNull()', () => {
    test('Should return true when testing null', () => {
      expect(Validators.isNull(null)).toBe(true)
    })
  
    const cases = [ [undefined], [0], [true], [false], ['foo'], [{}], [[]] ]
    test.each(cases)('Should return false when providin %p argument', (argument) => {
      expect(Validators.isNull(argument)).toBe(false)
    })
  })

  describe('isString()', () => {
    const trueCases = [ [''], ['undefined'], ['1'] ]
    test.each(trueCases)('Should return true when testing %p', (argument) => {
      expect(Validators.isString(argument)).toBe(true)
    })
  
    const cases = [ [undefined], [0], [1], [true], [false], [{}], [[]] ]
    test.each(cases)('Should return false when testing %p argument', (argument) => {
      expect(Validators.isString(argument)).toBe(false)
    })
  })

  describe('isNumber()', () => {
    const trueCases = [ [0], [0x43], [0.1], [.1] ]
    test.each(trueCases)('Should return true when testing %p', (argument) => {
      expect(Validators.isNumber(argument)).toBe(true)
    })
  
    const cases = [ [undefined], [null], [''], [true], [false], ['0'], ['0x43'], ['0.1'], ['.1'] ]
    test.each(cases)('Should return false when testing %p', (argument) => {
      expect(Validators.isNumber(argument)).toBe(false)
    })
  })
  
  describe('isBoolean()', () => {
    const trueCases = [ [true], [false] ]
    test.each(trueCases)('Should return true when testing %p', (argument) => {
      expect(Validators.isBoolean(argument)).toBe(true)
    })
  
    const cases = [ [undefined], [null], [''], ['true'], ['false'], ['0'], ['0x43'], [0], [1] ]
    test.each(cases)('Should return false when testing %s', (argument) => {
      expect(Validators.isBoolean(argument)).toBe(false)
    })
  })
  
  describe('isObject()',  () => {
    const trueCases = [ [{}], [[]], [{ foo: 'bar' }], null ]
    test.each(trueCases)('Should return true when testing %p', (argument) => {
      expect(Validators.isObject(argument)).toBe(true)
    })
  
    const cases = [ [undefined], [''], ['true'], ['false'], [true], [false], ['0'], ['0x43'], [0], [1] ]
    test.each(cases)('Should return false when testing %s', (argument) => {
      expect(Validators.isObject(argument)).toBe(false)
    })
  })
  
  describe('isArray()',  () => {
    const trueCases = [ [[0, 1]], [[]], [[,]] ]
    test.each(trueCases)('Should return true when testing %p', (argument) => {
      expect(Validators.isArray(argument)).toBe(true)
    })
  
    const cases = [ [undefined], [null], [''], [true], [false], ['true'], ['false'], ['0'], ['0x43'], [0], [1], [0x43], [{}], [{ foo: 'bar' }] ]
    test.each(cases)('Should return false when testing %s', (argument) => {
      expect(Validators.isArray(argument)).toBe(false)
    })
  })

  describe('isBetween()', () => {
    const trueCases = [
      [10, 0, 100],
      [1, 1, 1],
      ['1', 0, 100],
      ['2', 0, 100]
    ]
    test.each(trueCases)('Should return true when testing %p', (value, min, max) => {
      expect(Validators.isBetween(value, min, max)).toBe(true)
    })
  
    const cases = [
      [-1, 0, 100],
      [101, 0, 100],
      [1, 0, 0],
      [-1, 0, 100],
    ]
    test.each(cases)('Should return false when testing %s', (value, min, max) => {
      expect(Validators.isBetween(value, min, max)).toBe(false)
    })
  })
  
  describe('isNotBetween()', () => {
    const trueCases = [
      [-1, 0, 100],
      [101, 0, 100],
      [1, 0, 0],
      [-1, 0, 100],
    ]
    test.each(trueCases)('Should return true when testing %p', (value, min, max) => {
      expect(Validators.isNotBetween(value, min, max)).toBe(true)
    })
  
    const cases = [
      [10, 0, 100],
      [1, 1, 1],
      ['1', 0, 100],
      ['2', 0, 100]
    ]
    test.each(cases)('Should return false when testing %s', (value, min, max) => {
      expect(Validators.isNotBetween(value, min, max)).toBe(false)
    })
  })
})






