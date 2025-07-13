import {computePerformanceMultiplier, tick} from '../src/utils/simEngine';
import {createBuilding} from '../src/utils/gameActions';
import SIZE_PRESETS from '../src/constants/sizePresets';
import GPU_TYPES from '../src/constants/gpuTypes';

describe('cooling & throttling system', () => {
  test('performance multiplier thresholds', () => {
    expect(computePerformanceMultiplier(10, 10)).toBe(1);
    expect(computePerformanceMultiplier(11, 10)).toBe(0.5);
    expect(computePerformanceMultiplier(20, 10)).toBe(0.5);
    expect(computePerformanceMultiplier(21, 10)).toBe(0.25);
  });

  test('tick integration with heat buildup', () => {
    const b = createBuilding(SIZE_PRESETS[0]);
    // give 20 basic gpus
    b.gpuCounts[0] = 20;
    const state = {money: 0, buildings: [b]};

    let s = tick(state); // tick1
    expect(s.money).toBeCloseTo(9);
    expect(s.buildings[0].currentHeat).toBe(10);
    expect(s.buildings[0].throttleState).toBe('Yellow');
    s = tick(s); // tick2
    expect(s.money).toBeCloseTo(13);
    expect(s.buildings[0].currentHeat).toBe(20);
    expect(s.buildings[0].throttleState).toBe('Red');
    s = tick(s); // tick3
    expect(s.money).toBeCloseTo(17);
    expect(s.buildings[0].currentHeat).toBe(30);
    expect(s.buildings[0].throttleState).toBe('Red');
  });

  test('immediate throttling when heat exceeds capacity', () => {
    const b = createBuilding(SIZE_PRESETS[0]);
    b.gpuCounts[0] = 15; // generates 15 heat per tick
    const state = {money: 0, buildings: [b]};

    const s = tick(state);
    expect(s.buildings[0].throttleState).toBe('Yellow');
  });
});
