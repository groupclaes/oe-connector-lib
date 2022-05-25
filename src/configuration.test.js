
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

    test('should throw an error when options is empty object', () => {
      expect(() => config.configure({})).toThrow('Options object must contain at least one property!')
    })

    const invalidNames = [[1234], [{}], [true], [false], [null]]
    test.each(invalidNames)('should throw an error when username is not a string', (name) => {
      const executeFunction = () =>
        config.configure({
          username: name
        });

      expect(executeFunction).toThrow('username must be a string!')
    })

    test.each(invalidNames)('should throw an error when app is not a string', (name) => {
      const executeFunction = () =>
        config.configure({
          app: name
        });

      expect(executeFunction).toThrow('app must be a string!')
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

      expect(executeFunction).toThrow('username is invalid and should match only letters, numbers, dashes and underscores with a max length of 32 characters!')
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

      expect(executeFunction).toThrow('password is invalid and should match only letters, numbers, dashes, underscores or any of the following characters: @$!%*#?& with a max length of 32 characters!')
    })

    const invalidAppStrings = [
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
    test.each(invalidAppStrings)('should throw an error when the app is a regex failure', (name) => {
      const executeFunction = () =>
        config.configure({
          app: name
        });

      expect(executeFunction).toThrow('app is invalid and should match only letters, numbers, dashes and underscores with a max length of 32 characters!')
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

    const invalidPorts = [['hello world'], [true], [false], [null], ['2']]
    test.each(invalidPorts)('should throw an error when the port is not a number', (value) => {
      const executeFunction = () => config.configure({ port: value });

      expect(executeFunction).toThrow('port must be a number!')
    })
    const invalidPortsValues = [[-100000], [-1], [0], [65536], [1000000]]
    test.each(invalidPortsValues)('should throw an error when the port is not in the valid range', (value) => {
      const executeFunction = () => config.configure({ port: value });

      expect(executeFunction).toThrow('port must be between 1 and 65535!')
    })

    const validPortValues = [[1], [10000], [8080], [25565], [65535]]
    test.each(validPortValues)('should not throw when the port is in the valid range', (value) => {
      const executeFunction = () => config.configure({ port: value });

      expect(executeFunction).not.toThrow()
    })

    const invalidTimeWindow = [['hello world'], [''], [null], ['2']]
    test.each(invalidTimeWindow)('should throw an error when the time window is not a number', (tw) => {
      const executeFunction = () => config.configure({ tw })

      expect(executeFunction).toThrow('tw must be a number!')
    })

    const invalidTimeWindowValues = [[-10], [300001], [23432423]]
    test.each(invalidTimeWindowValues)('should throw an error when the time window is not within the valid range', (tw) => {
      const executeFunction = () => config.configure({ tw })

      expect(executeFunction).toThrow('tw must be between -1 and 300000!')
    })
    const validTimeWindowValues = [[100], [12345], [123456], [300000]]
    test.each(validTimeWindowValues)('should throw an error when the time window is not within the valid range', (tw) => {
      const executeFunction = () => config.configure({ tw })

      expect(executeFunction).not.toThrow()
    })

    const invalidCacheValues = [['Hello world'], ['true'], ['false'], [1], [2], [0], [{}], [[]], [null]]
    test.each(invalidCacheValues)('should throw an error if cache enabled \'c\' is not a boolean', (value) => {
      const executeFunction = () => config.configure({ c: value })

      expect(executeFunction).toThrow('c must be a boolean!')
    })

    const validCacheValues = [[true], [false]]
    test.each(validCacheValues)('should not throw if cache enabled \'c\' is valid', (value) => {
      const executeFunction = () => config.configure({ c: value })

      expect(executeFunction).not.toThrow()
    })

    const invalidCacheTimeoutValues = [['Hello world'], ['true'], ['false'], [true], [false], [{}], [[]], [null]]
    test.each(invalidCacheTimeoutValues)('should throw an error if cache time \'ct\' is not a number', (value) => {
      const executeFunction = () => config.configure({ ct: value })

      expect(executeFunction).toThrow('ct must be a number!')
    })

    const outOfRangeCacheTimeoutValues = [[86400001], [-2], [99999999]]
    test.each(outOfRangeCacheTimeoutValues)('should not throw if cache time \'ct\' is a number within the range of -1 and 86400000', (value) => {
      const executeFunction = () => config.configure({ ct: value })

      expect(executeFunction).toThrow('ct must be between -1 and 86400000!')
    })

    const validCacheTimeoutValues = [[-1], [60000], [86400000], [100000], [1234567]]
    test.each(validCacheTimeoutValues)('should not throw if cache time \'ct\' is a number within the range of -1 and 86400000', (value) => {
      const executeFunction = () => config.configure({ ct: value })

      expect(executeFunction).not.toThrow()
    })

    test('should apply correct configuration', () => {
      const validConfiguration = {
        username: 'username',
        password: 'password',
        host: 'localhost',
        ssl: true,
        port: 5000,
        tw: 2000,
        c: true,
        ct: 60000
      }

      const executeFunction = () => config.configure(validConfiguration);

      expect(executeFunction).not.toThrow();

      expect(config.configuration.username).toMatch('username')
      expect(config.configuration.password).toMatch('password')
      expect(config.configuration.host).toMatch('localhost')
      expect(config.configuration.ssl).toBe(true)
      expect(config.configuration.port).toBe(5000)
      expect(config.configuration.tw).toBe(2000)
      expect(config.configuration.c).toBe(true)
      expect(config.configuration.ct).toBe(60000)
    })
  })

  describe('configuration', () => {
    let config

    beforeEach(() => {
      config = new Configuration();
    })

    test('get should be equal to internal _conf', () => {
      expect(config.configuration).toStrictEqual(config._conf);
    })

    test('set should set replace the internal _conf reference', () => {
      const p = config._conf

      p.c = false
      config.configuration = p

      expect(config._conf).toStrictEqual(p)
    })
  })
})
