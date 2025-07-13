import SIZE_PRESETS from '../src/constants/sizePresets';

describe('SIZE_PRESETS', () => {
  it('defines four building sizes with costs', () => {
    expect(SIZE_PRESETS).toHaveLength(4);
    expect(SIZE_PRESETS[0]).toMatchObject({label: 'Small (10 racks)', capacity: 10});
    expect(SIZE_PRESETS[3]).toMatchObject({label: 'Mega (10k racks)', capacity: 10000});
  });
});
