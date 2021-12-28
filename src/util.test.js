const util = require('./util')

describe('util', () => {
  describe('getEnvVariable()', () => {
    test('Should throw name error when no parameters are given', () => {
      expect(() => util.getEnvVariable()).toThrow('Name must be supplied!')
    })
    test('Should throw name error when undefined name is given', () => {
      expect(() => util.getEnvVariable(undefined)).toThrow('Name must be supplied!')
    })


    const invalidNameCases = [ [true], [false], [null], [1], [0.2] ]
    test.each(invalidNameCases)('Should throw an error when invalid name is supplied', (value) => {
      expect(() => util.getEnvVariable(value)).toThrow('Name must be a string!')
    })

    const invalidEnvVars = [
      ['GHJKDSGSFKHJG_FIDLSKHF'],
      ['1e1a72c2-e15b-4970-aad3-3e2f4e2d7c0e'],
      ['1e1a72c2e15b4970aad33e2f4e2d7c0e'],
      ['GHJKDSGSTRETE_FIDLSKHF'],
      ['GH342SGSFKHJG_FIDLSKHF'],
    ]
    test.each(invalidEnvVars)('Should return the default value if the env var isn\'t set', (value) => {
      const result = util.getEnvVariable(value, 'testFallback')
    
      expect(result).toMatch('testFallback')
    })

    test('Should return correct environment var value', () => {
      process.env['TEST_VARIABLE'] = 'Some_Test_Value'

      const result = util.getEnvVariable('TEST_VARIABLE', 'testFallback')

      expect(result).toMatch('Some_Test_Value')
    })
  })
})
