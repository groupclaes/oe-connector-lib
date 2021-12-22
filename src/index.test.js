const oe = require('./index')

test('oe.test testProcedure should return valid payload', () => {
  oe.configure({
    username: 'username',
    password: 'password',
    host: 'localhost',
    port: 5000,
    tw: 2000,
    c: true,
    ct: 60000
  })

  expect(oe.test('testProcedure', [
    "testProcedure", // string parameter
    true, // boolean parameter
    undefined // undefined (output parameter)
  ])).toStrictEqual({
    proc: "testProcedure.p",
    parm: [
      { pos: 1, value: "testProcedure" },
      { pos: 2, type: "boolean", value: true },
      { pos: 3, out: true }
    ],
    cache: 60000,
    tw: 2000
  })
})

test('oe.test testProcedure with options should should return valid payload with custom options', () => {
  oe.configure({
    host: 'oe-server.example.com',
    c: false,
    tw: 500
  })

  expect(oe.test('testProcedure', [
    "Stringparameter", // string parameter
    50, // number parameter
    true, // boolean parameter
    undefined // undefined (output parameter)
  ], {
    c: true,
    ct: 60000,
    tw: 5000
  })).toStrictEqual({
    proc: "testProcedure.p",
    parm: [
      { pos: 1, value: "Stringparameter" },
      { pos: 2, type: "integer", value: 50 },
      { pos: 3, type: "boolean", value: true },
      { pos: 4, out: true }
    ],
    cache: 60000,
    tw: 5000
  })
})

test('oe.test should add \'.p\' to the procedure name if no dot is present', () => {
  expect(oe.test('test', []).proc).toMatch('test.p')
  expect(oe.test('test.', []).proc).toMatch('test.')
  expect(oe.test('test.p', []).proc).toMatch('test.p')
  expect(oe.test('test.r', []).proc).toMatch('test.r')
})

test('oe.run should Throw when incorrect arguments are supplied', () => {
  oe.configure({
    host: 'oe-server.example.com',
    c: false,
    tw: 500
  })

  expect(() => oe.run()).toThrow('No name supplied!')
  expect(() => oe.run(null)).toThrow('name must not be null!')
  expect(() => oe.run(5893475)).toThrow('name must be a string!')
  expect(() => oe.run('CheckVat?.p')).toThrow('Name is invalid, should only contain letters, numbers or special characters: -._ or a space!')

  expect(() => oe.run('validName')).toThrow('No parameters supplied!')
  expect(() => oe.run('validName', null)).toThrow('parameters must not be null!')
  expect(() => oe.run('validName', 12)).toThrow('parameters must be an object (Array)!')
  expect(() => oe.run('validName', {})).toThrow('parameters must be an array!')
})

test('oe.run should reject when no connection to host', async () => {
  expect.assertions(1)
  try {
    await oe.run('test.p', [])
  } catch (e) {
    expect(e).toBeTruthy()
  }
})

test('oe.run should return value', async() => {
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