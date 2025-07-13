import {createBuilding, upgradePower, downgradePower} from '../src/utils/gameActions';
import SIZE_PRESETS from '../src/constants/sizePresets';
import POWER_TIERS from '../src/constants/powerTiers';

describe('power upgrade flows', () => {
  it('upgrades and downgrades power tiers with cost adjustments', () => {
    const b = createBuilding(SIZE_PRESETS[0]);
    const state = {money: 100000, buildings: [b]};
    // upgrade to tier 1 -> cost purchaseCost[1]
    let s = upgradePower(state, 0);
    expect(s.buildings[0].power.tier).toBe(1);
    expect(s.money).toBe(state.money - POWER_TIERS[1].purchaseCost);

    // downgrade back -> refund half of tier1 cost
    s = downgradePower(s, 0);
    expect(s.buildings[0].power.tier).toBe(0);
    expect(s.money).toBeCloseTo(state.money - POWER_TIERS[1].purchaseCost + POWER_TIERS[1].purchaseCost / 2);
  });
});
