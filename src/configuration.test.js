const Configuration = require('./configuration')
const config = new Configuration()

test('expect configure to throw error when options are invalid', () => {
  expect(() => config.configure({})).toThrow('Options object must contain at least one property!')

  expect(() => config.configure()).toThrow('No Options supplied!')

  expect(() => config.configure(undefined)).toThrow('No Options supplied!')

  expect(() => config.configure(null)).toThrow('Options must not be null!')

  expect(() => config.configure('foo')).toThrow('Options must be an object!')

  expect(() => config.configure([12, 23])).toThrow('Options must not be an array!')

  expect(() => config.configure({
    username: 3000,
  })).toThrow('username must be a string!')
  expect(() => config.configure({
    username: '#$%^#kshjfs',
  })).toThrow('username is invalid should match only letters, numbers, dashes and underscores with a max length of 32 characters!')

  expect(() => config.configure({
    password: 3000,
  })).toThrow('password must be a string!')
  expect(() => config.configure({
    password: '  dfjkshgka&*^*'
  })).toThrow('password is invalid should match only letters, numbers, dashes, underscores or any of the following characters: @$!%*#?& with a max length of 32 characters!')

  expect(() => config.configure({
    host: 3000,
  })).toThrow('host must be a string!')
  expect(() => config.configure({
    host: 'google--fdkjhfjsgs.fkldsjhgs'
  })).toThrow('host is invalid should match valid FQDN or hostname!')

  expect(() => config.configure({
    port: 'hello world'
  })).toThrow('port must be a number!')
  expect(() => config.configure({
    port: 78543629734652
  })).toThrow('port must be between 1 and 65535!')

  expect(() => config.configure({
    tw: 'hello world',
  })).toThrow('tw must be a number!')
  expect(() => config.configure({
    tw: 1
  })).toThrow('tw must be between 100 and 300000!')

  expect(() => config.configure({
    c: 'hello world',
  })).toThrow('c must be a boolean!')

  expect(() => config.configure({
    ct: 'hello world',
  })).toThrow('ct must be a number!')
  expect(() => config.configure({
    ct: 1
  })).toThrow('ct must be between 60000 and 86400000!')
})

test('configure should apply configuration', () => {
  config.configure({
    username: 'username',
    password: 'password',
    host: 'localhost',
    ssl: true,
    port: 5000,
    tw: 2000,
    c: true,
    ct: 60000
  })

  expect(config.configuration.username).toMatch('username')
  expect(config.configuration.password).toMatch('password')
  expect(config.configuration.host).toMatch('localhost')
  expect(config.configuration.ssl).toBe(true)
  expect(config.configuration.port).toBe(5000)
  expect(config.configuration.tw).toBe(2000)
  expect(config.configuration.c).toBe(true)
  expect(config.configuration.ct).toBe(60000)
})

test('get() configuration should equal _conf', () => {
  expect(config.configuration).toBe(config._conf)
})

test('set() configuration should apply _conf', () => {
  const p = config._conf

  p.c = false
  config.configuration = p

  expect(config._conf).toBe(p)
})