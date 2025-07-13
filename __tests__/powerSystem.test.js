import {computePowerCost, tick} from '../src/utils/simEngine';
import {createBuilding, upgradePower} from '../src/utils/gameActions';
import SIZE_PRESETS from '../src/constants/sizePresets';
import POWER_TIERS from '../src/constants/powerTiers';

describe('power system', () => {
  test('computePowerCost scenarios', () => {
    expect(computePowerCost(0, 50, 0.05)).toBe(0);
    expect(computePowerCost(50, 50, 0.05)).toBeCloseTo(2.5);
    expect(computePowerCost(60, 50, 0.05)).toBeCloseTo(3.5);
  });

  test('tick applies power cost and draw', () => {
    const b = createBuilding(SIZE_PRESETS[0]);
    b.gpuCounts[0] = 10; // 10 basic GPUs
    const state = {money: 0, buildings: [b]};
    const s = tick(state);
    expect(s.buildings[0].currentPowerDraw).toBe(10);
    expect(s.buildings[0].currentPowerCost).toBeCloseTo(0.5);
    expect(s.money).toBeCloseTo(9.5);
  });

  test('upgradePower updates tier and deducts funds', () => {
    const b = createBuilding(SIZE_PRESETS[0]);
    const state = {money: 10000, buildings: [b]};
    const s = upgradePower(state, 0);
    expect(s.buildings[0].power.tier).toBe(1);
    expect(s.buildings[0].power.capacity).toBe(POWER_TIERS[1].capacity);
    expect(s.buildings[0].power.costPerUnit).toBe(POWER_TIERS[1].cost);
    expect(s.money).toBe(10000 - POWER_TIERS[1].purchaseCost);
  });
});
