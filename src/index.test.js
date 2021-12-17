const oe = require('./index')

test('expect to throw error when options is invalid', () => {
  expect(() => oe.configure({})).toThrow('Options object must contain at least one property!')

  expect(() => oe.configure()).toThrow('No Options supplied!')

  expect(() => oe.configure(undefined)).toThrow('No Options supplied!')

  expect(() => oe.configure(null)).toThrow('Options must not be null!')

  expect(() => oe.configure([12, 23])).toThrow('Options must not be an array!')

  expect(() => oe.configure({
    username: 3000,
  })).toThrow('Username must be a string!')
  expect(() => oe.configure({
    username: '#$%^#kshjfs',
  })).toThrow('Username must contain only letters, numbers, dashes and underscores with a max length of 255 characters!')

  expect(() => oe.configure({
    password: 3000,
  })).toThrow('Password must be a string!')
  expect(() => oe.configure({
    password: '  dfjkshgka&*^*'
  })).toThrow('Password must contain only letters, numbers, dashes, underscores or any of the following characters: @$!%*#?& with a max length of 255 characters!')

  expect(() => oe.configure({
    host: 3000,
  })).toThrow('Host must be a string!')
  expect(() => oe.configure({
    host: 'google--fdkjhfjsgs.fkldsjhgs'
  })).toThrow('Host is invalid should be a valid FQDN or Hostname!')

  expect(() => oe.configure({
    port: 'hello world'
  })).toThrow('Port must be a number!')
  expect(() => oe.configure({
    port: 78543629734652
  })).toThrow('Port must be between 1 and 65535!')

  expect(() => oe.configure({
    tw: 'hello world',
  })).toThrow('TimeWindow must be a number!')
  expect(() => oe.configure({
    tw: 1
  })).toThrow('TimeWindow must be between 100 and 300000!')

  expect(() => oe.configure({
    c: 'hello world',
  })).toThrow('CacheEnabled must be a boolean!')

  expect(() => oe.configure({
    ct: 'hello world',
  })).toThrow('CacheTime must be a number!')
  expect(() => oe.configure({
    ct: 1
  })).toThrow('CacheTime must be between 60000 and 86400000!')
})

test('oe.configure should apply configuration', () => {
  oe.configure({
    username: 'username',
    password: 'password',
    host: 'localhost',
    port: 5000,
    tw: 2000,
    c: true,
    ct: 60000
  })

  expect(oe.configuration.username).toMatch('username')
  expect(oe.configuration.password).toMatch('password')
  expect(oe.configuration.host).toMatch('localhost')
  expect(oe.configuration.port).toBe(5000)
  expect(oe.configuration.tw).toBe(2000)
  expect(oe.configuration.c).toBe(true)
  expect(oe.configuration.ct).toBe(60000)
})

test('oe.test testProcedure should return valid payload', () => {
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

// test('oe.run should complete successfully', async () => {

// })