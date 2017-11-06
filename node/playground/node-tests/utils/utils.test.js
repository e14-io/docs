const utils = require('./utils');


describe('tests', () => {
  test('test 1', () => {
    var res = utils.add(3, 9);
    expect(res).toBe(12);
  });

  test('test 2', () => {
    var res = utils.add(3, 4);
    expect(res).toBeLessThan(13);
  });

  test('test 3', () => {
    var obj = {
      value1: 3,
      value2: 5
    };
    expect(obj.value1).toBe(3);
  });
});