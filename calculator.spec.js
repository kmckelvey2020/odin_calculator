const calculate = require('./script.js')

describe('calculate', () => {
  test('adds two numbers', () => {
    expect(calculate(1, 4)).toEqual(10);
  });
  test('adds multiple numbers', () => {
    expect(calculate(1, 4000)).toEqual(8002000);
  });
  test('subtracts two numbers', () => {
    expect(calculate(123, 1)).toEqual(7626);
  });
  test('subtracts multiple numbers', () => {
    expect(calculate(-10, 4)).toEqual('ERROR');
  });
  test('handles mixed addition and subtraction', () => {
    expect(calculate(10, "90")).toEqual('ERROR');
  });
  test('multiplies two numbers', () => {
    expect(calculate()).toEqual('');
  });
  test('multiplies a several numbers in order left to right', () => {
    expect(calculate()).toEqual('');
  });
  test('divides two numbers', () => {
    expect(calculate()).toEqual('');
  });
  test('divides several numbers in order left to right', () => {
    expect(calculate()).toEqual('');
  });
  test('handles mixed multiplication and division', () => {
    expect(calculate()).toEqual('');
  });
  test('handles mixed multiplication, division, addition, subtraction', () => {
    expect(calculate()).toEqual('');
  });
  test('handles mixed multiplication, division, addition, subtraction', () => {
    expect(calculate()).toEqual('');
  });
  test('handles mixed multiplication, division, addition, subtraction', () => {
    expect(calculate()).toEqual('');
  });
  test('handles mixed multiplication, division, addition, subtraction', () => {
    expect(calculate()).toEqual('');
  });
  test('can raise a base number to an exponent', () => {
    expect(calculate()).toEqual('');
  });
  test('can raise a base number to a power raised to a power', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle exponents combined with addition, subtraction, multiplication, and division', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle exponents combined with addition, subtraction, multiplication, and division', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle exponents combined with addition, subtraction, multiplication, and division', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle exponents combined with addition, subtraction, multiplication, and division', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle exponents combined with addition, subtraction, multiplication, and division', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle exponents combined with addition, subtraction, multiplication, and division', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle expressions contained in parenthesis', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle expressions with nested parentheses by working from inner parentheses to outer parentheses', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle expressions with nested parentheses by working from inner parentheses to outer parentheses', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle expressions with nested parentheses by working from inner parentheses to outer parentheses', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle expressions with nested parentheses by working from inner parentheses to outer parentheses', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle expressions with nested parentheses by working from inner parentheses to outer parentheses', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle expressions with nested parentheses by working from inner parentheses to outer parentheses', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle parentheses used as implied multiplication', () => {
    expect(calculate()).toEqual('');
  });
  test('can handle parenthesis used as implied multiplication along with nested parentheses', () => {
    expect(calculate()).toEqual('');
  });
});
