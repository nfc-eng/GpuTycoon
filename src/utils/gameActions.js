export function createBuilding(preset) {
  return {
    size: preset,
    gpus: 0,
    gpuCost: 100 * Math.pow(2, preset.costMultiplier),
    gpuIncome: 1,
    incomePerTick: 0,
    cooling: {
      tier: 0,
      costs: [
        500 * preset.costMultiplier,
        2000 * preset.costMultiplier,
        10000 * preset.costMultiplier,
      ],
    },
  };
}

export function addBuilding(state, preset) {
  if (state.money < preset.purchaseCost) return state;
  const newB = createBuilding(preset);
  return {
    ...state,
    money: state.money - preset.purchaseCost,
    buildings: [...state.buildings, newB],
  };
}

export function buyGPU(state, index) {
  const building = state.buildings[index];
  if (!building) return state;
  if (state.money < building.gpuCost || building.gpus >= building.size.capacity) return state;
  const updated = [...state.buildings];
  updated[index] = {
    ...building,
    gpus: building.gpus + 1,
    incomePerTick: building.incomePerTick + building.gpuIncome,
  };
  return {
    ...state,
    money: state.money - building.gpuCost,
    buildings: updated,
  };
}

export function upgradeCooling(state, index) {
  const building = state.buildings[index];
  if (!building) return state;
  const {tier, costs} = building.cooling;
  if (tier >= costs.length - 1 || state.money < costs[tier]) return state;
  const updated = [...state.buildings];
  updated[index] = {
    ...building,
    cooling: {
      ...building.cooling,
      tier: tier + 1,
    },
  };
  return {
    ...state,
    money: state.money - costs[tier],
    buildings: updated,
  };
}
