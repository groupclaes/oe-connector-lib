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
})
