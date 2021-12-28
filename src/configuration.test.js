
const { describe, expect, test, beforeEach } = require('@jest/globals')


const Configuration = require('./configuration')

describe('Configuration', () => {
  describe('configure()', () => {
    let config

    beforeEach(() => {
      config = new Configuration();
    })

    test('should throw an error when options is empty', () => {
      expect(() => config.configure()).toThrow('No Options supplied!')
    })
    test('should throw an error when options is undefined', () => {
      expect(() => config.configure(undefined)).toThrow('No Options supplied!')
    })
    test('should throw an error when options is null', () => {
      expect(() => config.configure(null)).toThrow('Options must not be null!')
    })
    test('should throw an error when options is not an object', () => {
      expect(() => config.configure('foo')).toThrow('Options must be an object!')
    })
    test('should throw an error when options is null', () => {
      expect(() => config.configure([12, 23])).toThrow('Options must not be an array!')
    })

    const invalidNames = [ [1234], [{}], [true], [false], [null] ]
    test.each(invalidNames)('should throw an error when username is not a string', (name) => {
      const executeFunction = () =>
        config.configure({
          username: name
        });

      expect(executeFunction).toThrow('username must be a string!')
    })

    test.each(invalidNames)('should throw an error when password is not a string', (pwd) => {
      const executeFunction = () =>
        config.configure({
          password: pwd
        });

      expect(executeFunction).toThrow('password must be a string!')
    })

    test.each(invalidNames)('should throw an error when host is not a string', (name) => {
      const executeFunction = () =>
        config.configure({
          host: name
        });

      expect(executeFunction).toThrow('host must be a string!')
    })

    const invalidUsernameStrings = [
      [''],
      [' '],
      ['a'.repeat(256)],
      ['normal{'],
      ['normal\''],
      ['normal\"'],
      ['normal+'],
      ['normal='],
      ['normal^'],
      ['normal]'],
      ['normal('],
      ['normal['],
      ['normal}'],
      ['normal@'],
      ['normal#'],
      ['normal$'],
      ['normal%'],
      ['normal^'],
    ]
    test.each(invalidUsernameStrings)('should throw an error when the username is a regex failure', (name) => {
      const executeFunction = () =>
        config.configure({
          username: name
        });
  
      expect(executeFunction).toThrow('username is invalid and should match only letters, numbers, dashes and underscores with a max length of 255 characters!')
    })

    const invalidPasswordStrings = [
      [''],
      [' '],
      ['password^'],
      ['password('],
      ['password)'],
      ['password{'],
      ['password}'],
      ['password]'],
      ['password['],
      ['password\''],
      ['password\"'],
      ['password|'],
      ['password\\'],
      ['a'.repeat(256)]
    ]
    test.each(invalidPasswordStrings)('should throw an error when the password is a regex failure', (pwd) => {
      const executeFunction = () =>
        config.configure({
          password: pwd
        });
  
      expect(executeFunction).toThrow('password is invalid and should match only letters, numbers, dashes, underscores or any of the following characters: @$!%*#?& with a max length of 255 characters!')
    })

    const invalidFqdnHostnames = [
      ['google--fdkjhfjsgs.fkldsjhgs'],
      ['test@2323)(*&#'],
      ['valid.com#'],
      ['valid.com.#'],
      ['valid.'],
    ]
    test.each(invalidFqdnHostnames)('should throw an error when the hostname is not a valid FQDN', (hostname) => {
      const executeFunction = () =>
        config.configure({
          host: hostname
        });
  
      expect(executeFunction).toThrow('host is invalid and should match valid FQDN or hostname!')
      
    })

    const invalidPorts = [ ['hello world'], [true], [false], [null], ['2'] ]
    test.each(invalidPorts)('should throw an error when the port is not a number', (value) => {
      const executeFunction = () => config.configure({ port: value });

      expect(executeFunction).toThrow('port must be a number!')
    })
    const invalidPortsValues = [ [-100000], [-1], [0], [65536], [1000000] ]
    test.each(invalidPortsValues)('should throw an error when the port is not in the valid range', (value) => {
      const executeFunction = () => config.configure({ port: value });

      expect(executeFunction).toThrow('port must be between 1 and 65535!')
    })
    
    const validPortValues = [ [1], [10000], [8080], [25565], [65535] ]
    test.each(validPortValues)('should not throw when the port is in the valid range', (value) => {
      const executeFunction = () => config.configure({ port: value });

      expect(executeFunction).not.toThrow()
    })

    const invalidTimeWindow = [ ['hello world'], [''], [null], ['2'] ]
    test.each(invalidTimeWindow)('should throw an error when the time window is not a number', (tw) => {
      const executeFunction = () => config.configure({ tw })

      expect(executeFunction).toThrow('tw must be a number!')
    })

    const invalidTimeWindowValues = [ [-1], [0], [1], [10], [99], [300001], [23432423] ]
    test.each(invalidTimeWindowValues)('should throw an error when the time window is not within the valid range', (tw) => {
      const executeFunction = () => config.configure({ tw })

      expect(executeFunction).toThrow('tw must be between 100 and 300000!')
    })
    const validTimeWindowValues = [ [100], [12345], [123456], [300000] ]
    test.each(validTimeWindowValues)('should throw an error when the time window is not within the valid range', (tw) => {
      const executeFunction = () => config.configure({ tw })

      expect(executeFunction).not.toThrow()
    })
  })
})

const config = new Configuration()
test('expect configure to throw error when options are invalid', () => {

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
    port: 5000,
    tw: 2000,
    c: true,
    ct: 60000
  })

  expect(config.configuration.username).toMatch('username')
  expect(config.configuration.password).toMatch('password')
  expect(config.configuration.host).toMatch('localhost')
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