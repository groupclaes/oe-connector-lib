const param = require('./oe-param')

test('build() should validate input', () => {
  expect(() => param.build({})).toThrow('parameters must be an array!')
  expect(() => param.build(123)).toThrow('parameters must be an array!')
  expect(() => param.build(undefined)).toThrow('parameters must be an array!')
  expect(() => param.build(null)).toThrow('parameters must be an array!')
})

test('build() should return valid parameters', () => {
  expect(param.build([
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
  })).toStrictEqual([
    { pos: 1, type: "integer", value: 0 },
    { pos: 2, value: "help" },
    { pos: 3, type: "boolean", value: true },
    { pos: 4, out: true },
    { pos: 5, type: "json", value: { foo: 'bar' } }
  ])
})