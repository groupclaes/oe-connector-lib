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
    test('Should return valid payload with creds', () => {
      // Arrange
      const expectedResult = {
        proc: "testProcedure.p",
        parm: [
          { pos: 1, value: "testProcedure" },
          { pos: 2, type: "boolean", value: true },
          { pos: 3, type: 'string', out: true }
        ],
        creds: {
          user: 'username',
          pwd: 'password',
          app: 'app'
        },
        cache: 60000,
        tw: 2000
      }

      oe.configure({
        username: 'username',
        password: 'password',
        app: 'app',
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
      ], {
        parameterDefaults: {
          out: 'string'
        }
      });


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
        tw: 5000,
        creds: {
          user: 'oe-server',
          password: 'password'
        }
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
        tw: 5000,
        creds: {
          user: 'oe-server',
          password: 'password'
        }
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

    test('should handle parameters in advanced manner', () => {
      const expectedResult = [
        { pos: 1, value: 1, type: 'integer', redact: true }
      ]
      const parameters = [
        { value: 1, redact: true }
      ]


      const configuration = {
        c: true,
        ct: 60000,
        tw: 5000,
        creds: {
          user: 'oe-server',
          password: 'password'
        },
        parameterDefaults: {
          in: 'string',
          out: 'json'
        },
        simpleParameters: false
      }

      const result = oe.test('testProcedure', parameters, configuration)

      expect(result.parm).toStrictEqual(expectedResult)
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

    const invalidNames = [[''], ['CheckVat?.p'], ['CheckV!at.p'], ['Some@Procedure.p']]
    test.each(invalidNames)('Should throw when procedure name is not a string', (value) => {
      oe.configure({
        host: 'oe-server.example.com',
        c: false,
        tw: 500
      })

      expect(() => oe.run(value)).toThrow('Name is invalid, should only contain letters, numbers or special characters: -._ or a space (path is optional)!')
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
    test('Should reject when no connection to host', async () => {
      expect.assertions(1)
      try {
        await oe.run('test.p', [])
      } catch (e) {
        expect(e).toBeTruthy()
      }
    })

    test('should return value', async () => {
      jest.mock('https', () => ({
        ...jest.requireActual('https'), // import and retain the original functionalities
        request: (post_option, cb) => cb({
          on: (data, cb) => cb(Buffer.from(`{"title": "OK", "description": null, "proc": "test.p", "status": 200, "result": {"status": true}}`, 'utf8')),
          statusCode: 200,
          statusMessage: 'OK'
        }),
        on: jest.fn(),
        write: jest.fn(),
        end: jest.fn()
      }))

      oe.configure({
        host: 'oe-server',
        ssl: true,
        c: false,
        tw: 500
      })

      const req = await oe.run('test.p', [])

      expect(req).toStrictEqual({
        title: 'OK',
        description: null,
        proc: 'test.p',
        status: 200,
        result: {
          status: true
        }
      })
    })

    test('should return body value when not a string', async () => {
      jest.mock('http', () => ({
        ...jest.requireActual('http'), // import and retain the original functionalities
        request: (post_option, cb) => cb({
          on: (data, cb) => cb(0x43),
          statusCode: 200,
          statusMessage: 'OK'
        }),
        on: jest.fn(),
        write: jest.fn(),
        end: jest.fn()
      }))

      oe.configure({
        host: 'yayeet',
        ssl: false,
        c: false,
        tw: 500
      })

      expect(await oe.run('test.p', [])).toEqual(0x43)
    })
  })
})
