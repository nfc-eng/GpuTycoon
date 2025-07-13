import {buyGPU, upgradeCooling, createBuilding} from '../src/utils/gameActions';
import SIZE_PRESETS from '../src/constants/sizePresets';

describe('building actions', () => {
  function createState() {
    const building = createBuilding(SIZE_PRESETS[0]);
    return {money: 10000, buildings: [building]};
  }

  it('buys a GPU when possible', () => {
    const state = createState();
    const newState = buyGPU(state, 0);
    expect(newState.buildings[0].gpus).toBe(1);
    expect(newState.buildings[0].incomePerTick).toBe(1);
    expect(newState.money).toBe(state.money - state.buildings[0].gpuCost);
  });

  it('upgrades cooling when affordable', () => {
    const state = createState();
    const newState = upgradeCooling(state, 0);
    expect(newState.buildings[0].cooling.tier).toBe(1);
    expect(newState.money).toBe(state.money - state.buildings[0].cooling.costs[0]);
  });
});
