const { test } = require('@jest/globals')
const param = require('./oe-param')

describe('oe-param', () => {
  describe('build()', () => {
    const nonArrays = [ [{}], [123], [undefined], [null] ]
    test.each(nonArrays)('Should throw error message if params not an array', (value) => {
      expect(() => param.build(value)).toThrow('parameters must be an array!')
    })

    test('Should return exact valid parameters', () => {
      const expectedResult = [
        { pos: 1, type: "integer", value: 0 },
        { pos: 2, value: "help" },
        { pos: 3, type: "boolean", value: true },
        { pos: 4, out: true },
        { pos: 5, type: "json", value: { foo: 'bar' } }
      ]
      

      const result = param.build([
        0,
        'help',
        true,
        undefined,
        { 
          foo: 'bar'
        }
      ], {
        parameterDefaults: {
          in: 'string',
          out: 'json'
        }
      })


      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('getInputParameter', () => {
    const configuration = { parameterDefaults: { in: 'json' }}
    test('should return correct input parameter object', () => {
      const value = { foo: 'bar', base64: Buffer.from('test', 'base64') }
      const expectedResult = {
        pos: 1, type: "json", value
      }

      const result = param.getInputParameter(1, value, configuration)

      expect(result).toStrictEqual(expectedResult)
    })

    test('should not set parameter type if parameter is NULL', () => {
      const expectedResult = {
        pos: 1, value: null
      }

      const result = param.getInputParameter(1, null, configuration)

      expect(result).toStrictEqual(expectedResult)
    })
  })

  describe('getAdvancedInputParameter', () => {
    const configuration = {
      parameterDefaults: {
        in: 'string',
        out: 'json'
      }
    }

    const advancedInputLabelTests = [
      ['test123', 'test123'],
      ['test', 'test'],
      [undefined, undefined],
      [null, undefined],
      [false, undefined]
    ]
    test.each(advancedInputLabelTests)('should set label correct', (label, expectedLabel) => {
      const parameter = param.getAdvancedInputParameter(13, { value: 1, label }, configuration)

      expect(parameter.label).toStrictEqual(expectedLabel)
    })


    const advancedInputTypeTests = [
      ['object', 'json'],
      ['json', 'json'],
      ['string', undefined],
      [undefined, 'integer'],
      [null, 'integer'],
      [false, undefined]
    ]
    test.each(advancedInputTypeTests)('should set correct input type', (type, expectedType) => {
      const parameter = param.getAdvancedInputParameter(13, { value: 1, type }, configuration)

      expect(parameter.type).toStrictEqual(expectedType)
    })

    const truthyTests = [ [true], [{}], [[]], ['test'], [1]]
    test.each(truthyTests)('should add redact to parameter', (redact) => {
      const parameter = param.getAdvancedInputParameter(13, { value: 1, redact }, configuration)

      expect(parameter.redact).toBe(true)
    })
    const falsyTests = [ [false], [null], [undefined] ]
    test.each(falsyTests)('should leave redact from parameter', (redact) => {
      const parameter = param.getAdvancedInputParameter(13, { value: 1, redact  }, configuration)

      expect(parameter.redact).toStrictEqual(undefined)
    })
  })

  describe('getAdvancedOutputParameter', () => {
    const configuration = {
      parameterDefaults: {
        in: 'json',
        out: 'json'
      }
    }
    test('should set correct index and out parameter fields', () => {
      const parameter = param.getAdvancedOutputParameter(2, { type: 'string' }, configuration)

      expect(parameter.pos).toBe(2)
      expect(parameter.out).toBe(true)
    })


    const parameterTypeTests = [
      [ null, undefined ],
      [ undefined, undefined ],
      [ 'string', 'string' ],
      [ 'number', 'integer' ],
      [ 'integer', 'integer' ],
      [ 'object', undefined ],
      [ 'json', undefined ]
    ]
    test.each(parameterTypeTests)('should set correct parameter type',
      (type, expectedType) => {
        const parameter = param.getAdvancedOutputParameter(13, { type  }, configuration)

        expect(parameter.type).toStrictEqual(expectedType)
      })

    const parameterForceArrayTests = [ [true, true], [false, undefined],
      [undefined, undefined], [null, undefined] ]
    test.each(parameterForceArrayTests)('should force array correctly', (ar, expectedForceArray) => {
      const parameter = param.getAdvancedOutputParameter(13, { type: 'string', ar }, configuration)

      expect(parameter.ar).toStrictEqual(expectedForceArray)
    })

    const parameterLabelTests = [ 
      ['test', 'test'],
      [undefined, undefined],
      [null, undefined],
      [false, undefined]
    ]
    test.each(parameterLabelTests)('should set label if present and valid', (label, expectedLabel) => {
      const parameter = param.getAdvancedOutputParameter(13, { type: 'string', label }, configuration)

      expect(parameter.label).toStrictEqual(expectedLabel)
    })
  })
})
