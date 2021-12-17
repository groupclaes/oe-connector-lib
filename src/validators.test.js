const Validators = require('./validators')

test('Validators.isUndefined()', () => {
  expect(Validators.isUndefined(undefined)).toBe(true)

  expect(Validators.isUndefined(null)).toBe(false)
  expect(Validators.isUndefined(0)).toBe(false)
  expect(Validators.isUndefined(true)).toBe(false)
  expect(Validators.isUndefined(false)).toBe(false)
  expect(Validators.isUndefined('foo')).toBe(false)
  expect(Validators.isUndefined({})).toBe(false)
  expect(Validators.isUndefined([])).toBe(false)
})

test('Validators.isNull()', () => {
  expect(Validators.isNull(null)).toBe(true)

  expect(Validators.isNull(undefined)).toBe(false)
  expect(Validators.isNull(0)).toBe(false)
  expect(Validators.isNull(true)).toBe(false)
  expect(Validators.isNull(false)).toBe(false)
  expect(Validators.isNull('foo')).toBe(false)
  expect(Validators.isNull({})).toBe(false)
  expect(Validators.isNull([])).toBe(false)
})

test('Validors.isString()', () => {
  expect(Validators.isString('')).toBe(true)
  expect(Validators.isString('undefined')).toBe(true)

  expect(Validators.isString(undefined)).toBe(false)
  expect(Validators.isString()).toBe(false)
  expect(Validators.isString(null)).toBe(false)
  expect(Validators.isString(0)).toBe(false)
  expect(Validators.isString(1)).toBe(false)
  expect(Validators.isString(true)).toBe(false)
  expect(Validators.isString(false)).toBe(false)
})

test('Validors.isNumber()', () => {
  expect(Validators.isNumber(0)).toBe(true)
  expect(Validators.isNumber(0x43)).toBe(true)

  expect(Validators.isNumber(undefined)).toBe(false)
  expect(Validators.isNumber(null)).toBe(false)
  expect(Validators.isNumber('')).toBe(false)
  expect(Validators.isNumber()).toBe(false)
  expect(Validators.isNumber(true)).toBe(false)
  expect(Validators.isNumber(false)).toBe(false)
  expect(Validators.isNumber('0')).toBe(false)
  expect(Validators.isNumber('0x43')).toBe(false)
})

test('Validors.isBoolean()', () => {
  expect(Validators.isBoolean(true)).toBe(true)
  expect(Validators.isBoolean(false)).toBe(true)

  expect(Validators.isBoolean(undefined)).toBe(false)
  expect(Validators.isBoolean(null)).toBe(false)
  expect(Validators.isBoolean('')).toBe(false)
  expect(Validators.isBoolean()).toBe(false)
  expect(Validators.isBoolean('true')).toBe(false)
  expect(Validators.isBoolean('false')).toBe(false)
  expect(Validators.isBoolean(0)).toBe(false)
  expect(Validators.isBoolean(0x43)).toBe(false)
})

test('Validors.isObject()', () => {
  expect(Validators.isObject({})).toBe(true)
  expect(Validators.isObject([])).toBe(true)
  expect(Validators.isObject({ foo: 'bar' })).toBe(true)
  expect(Validators.isObject(null)).toBe(true)

  expect(Validators.isObject(undefined)).toBe(false)
  expect(Validators.isObject('')).toBe(false)
  expect(Validators.isObject()).toBe(false)
  expect(Validators.isObject('true')).toBe(false)
  expect(Validators.isObject('false')).toBe(false)
  expect(Validators.isObject(0)).toBe(false)
  expect(Validators.isObject(0x43)).toBe(false)
})

test('Validors.isArray()', () => {
  expect(Validators.isArray([0, 1])).toBe(true)
  expect(Validators.isArray([])).toBe(true)
  expect(Validators.isArray([,])).toBe(true)

  expect(Validators.isArray(undefined)).toBe(false)
  expect(Validators.isArray(null)).toBe(false)
  expect(Validators.isArray('')).toBe(false)
  expect(Validators.isArray()).toBe(false)
  expect(Validators.isArray({})).toBe(false)
  expect(Validators.isArray({ foo: 'bar' })).toBe(false)
  expect(Validators.isArray()).toBe(false)
  expect(Validators.isArray('true')).toBe(false)
  expect(Validators.isArray('false')).toBe(false)
  expect(Validators.isArray(0)).toBe(false)
  expect(Validators.isArray(0x43)).toBe(false)
})

test('Validors.isBetween()', () => {
  expect(Validators.isBetween(10, 0, 100)).toBe(true)
  expect(Validators.isBetween(1, 1, 1)).toBe(true)

  expect(Validators.isBetween(-1, 0, 100)).toBe(false)
  expect(Validators.isBetween(101, 0, 100)).toBe(false)
})

test('Validors.isNotBetween()', () => {
  expect(Validators.isNotBetween(-1, 0, 100)).toBe(true)
  expect(Validators.isNotBetween(101, 0, 100)).toBe(true)

  expect(Validators.isNotBetween(10, 0, 100)).toBe(false)
  expect(Validators.isNotBetween(1, 1, 1)).toBe(false)
})