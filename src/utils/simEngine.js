import GPU_TYPES from '../constants/gpuTypes';
import COOLING_CAPACITY from '../constants/coolingTiers';

export function computePerformanceMultiplier(currentHeat, coolingCapacity) {
  if (currentHeat <= coolingCapacity) return 1.0;
  if (currentHeat <= 2 * coolingCapacity) return 0.5;
  return 0.25;
}

export function tick(state) {
  const buildings = state.buildings.map(b => {
    const heatGenerated = b.gpuCounts.reduce(
      (sum, count, i) => sum + count * GPU_TYPES[i].heat,
      0,
    );

    const coolingCapacity = COOLING_CAPACITY[b.cooling.tier] || 0;

    const preCoolingHeat = b.currentHeat + heatGenerated;
    const performanceMultiplier = computePerformanceMultiplier(
      preCoolingHeat,
      coolingCapacity,
    );

    const currentHeat = Math.max(0, preCoolingHeat - coolingCapacity);

    const baseIncome = b.gpuCounts.reduce(
      (sum, count, i) => sum + count * GPU_TYPES[i].income,
      0,
    );
    const effectiveIncome = baseIncome * performanceMultiplier;

    return {
      ...b,
      currentHeat,
      effectiveIncome,
      throttleState:
        performanceMultiplier === 1
          ? 'Green'
          : performanceMultiplier === 0.5
          ? 'Yellow'
          : 'Red',
    };
  });

  const money =
    state.money + buildings.reduce((sum, b) => sum + b.effectiveIncome, 0);

  return {...state, money, buildings};
}
