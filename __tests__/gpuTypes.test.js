import GPU_TYPES from '../src/constants/gpuTypes';

describe('GPU_TYPES', () => {
  it('defines three GPU tiers with costs and income', () => {
    expect(GPU_TYPES).toHaveLength(3);
    expect(GPU_TYPES[0]).toMatchObject({label: 'Basic GPU', cost: 100});
    expect(GPU_TYPES[2]).toMatchObject({label: 'Pro GPU', income: 150});
  });
});
