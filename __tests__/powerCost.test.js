import {computePowerCost} from '../src/utils/simEngine';

describe('computePowerCost', () => {
  it('costs zero when usage is zero', () => {
    expect(computePowerCost(0, 50, 0.05)).toBeCloseTo(0);
  });

  it('charges standard rate up to capacity', () => {
    expect(computePowerCost(40, 50, 0.05)).toBeCloseTo(2);
  });

  it('double charges above capacity', () => {
    // 60 used with 50 capacity -> 50*0.05 + 10*0.1 = 3.5
    expect(computePowerCost(60, 50, 0.05)).toBeCloseTo(3.5);
  });
});
