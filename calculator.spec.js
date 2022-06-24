const calculate = require('./calculator.js')

describe('calculate', () => {
  test('adds two numbers', () => {
    expect(calculate('354654+564')).toEqual(355218);
  });
  test('adds multiple numbers', () => {
    expect(calculate('751+978+8423659+214+5')).toEqual(8425607);
  });
  test('subtracts two numbers', () => {
    expect(calculate('78-43')).toEqual(35);
  });
  test('subtracts two numbers with negative result', () => {
    expect(calculate('54654-78972')).toEqual(-24318);
  });
  test('subtracts multiple numbers', () => {
    expect(calculate('64-140-79-82-51')).toEqual(-288);
  });
  test('handles mixed addition and subtraction', () => {
    expect(calculate('-8846+45684-8464-846+248468+258+9-1+0')).toEqual(276262);
  });
  test('multiplies two numbers', () => {
    expect(calculate('54*892')).toEqual(48168);
  });
  test('multiplies two numbers with negative result', () => {
    expect(calculate('19*-24')).toEqual(-456);
  });
  test('multiplies a several numbers in order left to right', () => {
    expect(calculate('8*63*4*-21*7')).toEqual(-296352);
  });
  test('multiplies by 0 gets zero', () => {
    expect(calculate('0*52')).toEqual(0);
  });
  test('divides two numbers', () => {
    expect(calculate('879/15')).toEqual(58.6);
  });
  test('divides two numbers', () => {
    expect(calculate('-5789/845')).toEqual(-6.85);
  });
  test('divides two numbers', () => {
    expect(calculate('45/824')).toEqual(0.05);
  });
  test('divides two numbers', () => {
    expect(calculate('78/-2')).toEqual(-39);
  });
  test('divides two numbers', () => {
    expect(calculate('-35/-7')).toEqual(5);
  });
  test('divides two numbers', () => {
    expect(calculate('0/54')).toEqual(0);
  });
  test('divides two numbers', () => {
    expect(calculate('5/0')).toEqual('Error: Are you trying to implode the universe? Dividing by zero is not allowed.');
  });
  test('divides several numbers in order left to right', () => {
    expect(calculate('72/8/2/4')).toEqual(1.13);
  });
  test('handles mixed multiplication and division', () => {
    expect(calculate('564154/8*5*3/4/1/2*8/6*85/5')).toEqual(2997068.13);
  });
  test('handles mixed multiplication, division, addition, subtraction', () => {
    expect(calculate('816/2*6+5-9*3+4/8')).toEqual(2426.5);
  });
  test('handles mixed multiplication, division, addition, subtraction', () => {
    expect(calculate('354564+6846846-543468*513513/8842*-2+48')).toEqual(70326968.76);
  });
  test('handles mixed multiplication, division, addition, subtraction', () => {
    expect(calculate('25176/391554*765255-5*426+5717/4+568-45')).toEqual(49026.34);
  });
  test('handles mixed multiplication, division, addition, subtraction', () => {
    expect(calculate('4+5/5*6-498+12')).toEqual(-476);
  });
  test('can raise a base number to an exponent', () => {
    expect(calculate('5^3')).toEqual(125);
  });
  test('can raise a base number to a power raised to a power', () => {
    expect(calculate('2^5^3')).toEqual(4.253529586511731e+37);
  });
  test('can handle exponents combined with addition, subtraction, multiplication, and division', () => {
    expect(calculate('15^2/5-6+77*3/4^2')).toEqual(53.44);
  });
  test('can handle expressions contained in parenthesis', () => {
    expect(calculate('15+(64/8-5)')).toEqual(18);
  });
  test('can handle expressions with nested parentheses by working from inner parentheses to outer parentheses', () => {
    expect(calculate('9+(45-(8*2+1)+16-(45/7+2(8+5)))')).toEqual(20.57);
  });
  test('can handle parentheses used as implied multiplication', () => {
    expect(calculate('9(8+5)(64/8-7)(15-5)')).toEqual(1170);
  });
  test('can handle parenthesis used as implied multiplication along with nested parentheses', () => {
    expect(calculate('(15-6*45)(5/2*9+4(15/7+6))')).toEqual(-14043.2);
  });
});
