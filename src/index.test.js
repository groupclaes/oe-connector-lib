const { describe, expect, test } = require('@jest/globals')

const oe = require('./index')

describe('OpenEdge', () => {
  describe('test', () => {
    test('Should return valid payload', () => {
      // Arrange
      const expectedResult = {
        proc: "testProcedure.p",
        parm: [
          { pos: 1, value: "testProcedure" },
          { pos: 2, type: "boolean", value: true },
          { pos: 3, out: true }
        ],
        cache: 60000,
        tw: 2000
      }

      oe.configure({
        username: 'username',
        password: 'password',
        host: 'localhost',
        port: 5000,
        tw: 2000,
        c: true,
        ct: 60000
      })

      // Act
      const result = oe.test('testProcedure', [
        "testProcedure", // string parameter
        true, // boolean parameter
        undefined // undefined (output parameter)
      ]);


      // Assert
      expect(result).toStrictEqual(expectedResult)
    })

    test('testProcedure with options should return valid payload with custom options', () => {
      // Arrange
      const expectedResult = {
        proc: "testProcedure.p",
        parm: [
          { pos: 1, value: "Stringparameter" },
          { pos: 2, type: "integer", value: 50 },
          { pos: 3, type: "boolean", value: true },
          { pos: 4, out: true }
        ],
        cache: 60000,
        tw: 5000
      }
      oe.configure({
        host: 'oe-server.example.com',
        c: false,
        tw: 500
      })


      const result = oe.test('testProcedure', [
        "Stringparameter", // string parameter
        50, // number parameter
        true, // boolean parameter
        undefined // undefined (output parameter)
      ], {
        c: true,
        ct: 60000,
        tw: 5000
      })

      expect(result).toStrictEqual(expectedResult)
    })

    const testPrefixCases = [
      ['test', 'test.p'],
      ['test.', 'test.'],
      ['test.p', 'test.p'],
      ['test.r', 'test.r']
    ]
    test.each(testPrefixCases)('Should add \'.p\' to the procedure name if no extention or dot is present', (input, expectedResult) => {
      const result = oe.test(input, [])

      expect(result.proc).toStrictEqual(expectedResult)
    })
  })
  describe('run()', () => {
    test('Should throw when no procedure name is supplied', () => {
      expect(() => oe.run()).toThrow('No name supplied!')
    })

    test('Should throw when procedure name is NULL', () => {
      expect(() => oe.run(null)).toThrow('name must not be null!')
    })

    test('Should throw when procedure name is not a string', () => {
      expect(() => oe.run(5893475)).toThrow('name must be a string!')
    })

    const invalidNames = [ [''], ['CheckVat?.p'], ['CheckV!at.p'], ['Some@Procedure.p'] ]
    test.each(invalidNames)('Should throw when procedure name is not a string', (value) => {
      oe.configure({
        host: 'oe-server.example.com',
        c: false,
        tw: 500
      })

      expect(() => oe.run(value)).toThrow('Name is invalid, should only contain letters, numbers or special characters: -._ or a space!')
    })

    const invalidArguments = [
      ['parameters must be an array!', 'CheckVat-.p', {}],
      ['parameters must be an object (Array)!', 'Check Vat.p', 12]
    ]
    test.each(invalidArguments)('Should throw when incorrect arguments are supplied', (expectedError, name, argumentList) => {
      oe.configure({
        host: 'oe-server.example.com',
        c: false,
        tw: 500
      })

      expect(() => oe.run(name, argumentList)).toThrow(expectedError)
    })

    test('Should throw when no arguments are supplied', () => {
      oe.configure({
        host: 'oe-server.example.com',
        c: false,
        tw: 500
      })

      expect(() => oe.run('CheckVat')).toThrow('No parameters supplied!')
    })

    test('Should throw when arguments are NULL', () => {
      oe.configure({
        host: 'oe-server.example.com',
        c: false,
        tw: 500
      })

      expect(() => oe.run('CheckVat', null)).toThrow('parameters must not be null!')
    })
  })
})
