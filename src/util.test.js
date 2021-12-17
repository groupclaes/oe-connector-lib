const util = require('./util')

test('util.getEnvVariable() should throw an error', () => {
  expect(() => util.getEnvVariable()).toThrow('Name must be supplied!')
  expect(() => util.getEnvVariable(undefined)).toThrow('Name must be supplied!')

  expect(() => util.getEnvVariable(123)).toThrow('Name must be a string!')
  expect(() => util.getEnvVariable(null)).toThrow('Name must be a string!')
})

test('util.getEnvVariable() should return the defaultValue', () => {
  expect(util.getEnvVariable('GHJKDSGSFKHJG_FIDLSKHF', 'testValue')).toMatch('testValue')
  expect(util.getEnvVariable('GHJKDDFSFKHJG_FIDLSKHF', 'testValue')).toMatch('testValue')
  expect(util.getEnvVariable('GHJKDSGSTRETE_FIDLSKHF', 'testValue')).toMatch('testValue')
  expect(util.getEnvVariable('GH342SGSFKHJG_FIDLSKHF', 'testValue')).toMatch('testValue')
  expect(util.getEnvVariable('GHJKH56SFKHJG_FIDLSKHF', 'testValue')).toMatch('testValue')
})

test('util.getEnvVariable() should return value of environment variable and thus not match defaultValue', () => {
  expect(util.getEnvVariable('PATH', 'testValue')).not.toMatch('testValue')
  expect(util.getEnvVariable('USER', 'testValue')).not.toMatch('testValue')
})