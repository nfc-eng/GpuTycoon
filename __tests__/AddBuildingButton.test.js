import {addBuilding} from '../src/utils/gameActions';
import SIZE_PRESETS from '../src/constants/sizePresets';

describe('addBuilding', () => {
  it('adds a building and deducts money', () => {
    const state = {money: 5000, buildings: []};
    const newState = addBuilding(state, SIZE_PRESETS[0]);
    expect(newState.money).toBe(state.money - SIZE_PRESETS[0].purchaseCost);
    expect(newState.buildings).toHaveLength(1);
    expect(newState.buildings[0].size).toEqual(SIZE_PRESETS[0]);
  });
});
