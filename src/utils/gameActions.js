import GPU_TYPES from '../constants/gpuTypes';
import POWER_TIERS from '../constants/powerTiers';

export function createBuilding(preset) {
  return {
    size: preset,
    gpuCounts: GPU_TYPES.map(() => 0),
    cooling: {
      tier: 0,
      costs: [
        500 * preset.costMultiplier,
        2000 * preset.costMultiplier,
        10000 * preset.costMultiplier,
      ],
    },
    currentHeat: 0,
    effectiveIncome: 0,
    throttleState: 'Green',
    power: {tier: 0},
    currentPowerDraw: 0,
    currentPowerCost: 0,
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

export function buyGPU(state, buildingIndex, gpuTypeIndex) {
  const building = state.buildings[buildingIndex];
  const gpu = GPU_TYPES[gpuTypeIndex];
  if (!building || !gpu) return state;
  const total = building.gpuCounts.reduce((sum, c) => sum + c, 0);
  if (state.money < gpu.cost || total >= building.size.capacity) return state;
  const updated = [...state.buildings];
  const newCounts = [...building.gpuCounts];
  newCounts[gpuTypeIndex] += 1;
  updated[buildingIndex] = {
    ...building,
    gpuCounts: newCounts,
  };
  return {
    ...state,
    money: state.money - gpu.cost,
    buildings: updated,
  };
}

export function sellGPU(state, buildingIndex, gpuTypeIndex) {
  const building = state.buildings[buildingIndex];
  const gpu = GPU_TYPES[gpuTypeIndex];
  if (!building || !gpu) return state;
  if (building.gpuCounts[gpuTypeIndex] <= 0) return state;
  const updated = [...state.buildings];
  const newCounts = [...building.gpuCounts];
  newCounts[gpuTypeIndex] -= 1;
  updated[buildingIndex] = {
    ...building,
    gpuCounts: newCounts,
  };
  return {
    ...state,
    money: state.money + gpu.cost / 2,
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

export function upgradePower(state, index) {
  const building = state.buildings[index];
  if (!building) return state;
  const tier = building.power.tier;
  if (tier >= POWER_TIERS.length - 1) return state;
  const nextCost = POWER_TIERS[tier + 1].purchaseCost;
  if (state.money < nextCost) return state;
  const updated = [...state.buildings];
  updated[index] = {
    ...building,
    power: {tier: tier + 1},
  };
  return {
    ...state,
    money: state.money - nextCost,
    buildings: updated,
  };
}

export function downgradePower(state, index) {
  const building = state.buildings[index];
  if (!building) return state;
  const tier = building.power.tier;
  if (tier <= 0) return state;
  const refund = POWER_TIERS[tier].purchaseCost / 2;
  const updated = [...state.buildings];
  updated[index] = {
    ...building,
    power: {tier: tier - 1},
  };
  return {
    ...state,
    money: state.money + refund,
    buildings: updated,
  };
}
