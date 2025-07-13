import {buyGPU, upgradeCooling, createBuilding} from '../src/utils/gameActions';
import SIZE_PRESETS from '../src/constants/sizePresets';
import GPU_TYPES from '../src/constants/gpuTypes';

describe('building actions', () => {
  function createState() {
    const building = createBuilding(SIZE_PRESETS[0]);
    return {money: 10000, buildings: [building]};
  }

  it('buys a GPU when possible', () => {
    const state = createState();
    const newState = buyGPU(state, 0, 0);
    expect(newState.buildings[0].gpuCounts[0]).toBe(1);
    expect(newState.money).toBe(state.money - GPU_TYPES[0].cost);
  });

  it('upgrades cooling when affordable', () => {
    const state = createState();
    const newState = upgradeCooling(state, 0);
    expect(newState.buildings[0].cooling.tier).toBe(1);
    expect(newState.money).toBe(state.money - state.buildings[0].cooling.costs[0]);
  });
});
