import React from 'react';
import renderer, {act} from 'react-test-renderer';

// Minimal mock for react-native primitives so the component can render
jest.mock('react-native', () => {
  const React = require('react');
  const RN = {};
  ['View', 'Text', 'TouchableOpacity', 'ScrollView'].forEach(tag => {
    RN[tag] = props => React.createElement(tag, props, props.children);
  });
  RN.StyleSheet = {create: styles => styles};
  RN.useColorScheme = () => 'dark';
  return RN;
});
import BuildingDetail from '../src/components/BuildingDetail';
import GameContext from '../src/context/GameContext';
import {createBuilding} from '../src/utils/gameActions';
import SIZE_PRESETS from '../src/constants/sizePresets';

function renderWithContext(ui, {state}) {
  let tree;
  act(() => {
    tree = renderer.create(
      <GameContext.Provider value={{state, setState: jest.fn(), setSelectedBuilding: jest.fn()}}>
        {ui}
      </GameContext.Provider>,
    );
  });
  return tree;
}

describe('BuildingDetail scroll view', () => {
  it('wraps content in a ScrollView so it can scroll', () => {
    const building = createBuilding(SIZE_PRESETS[0]);
    const state = {money: 0, buildings: [building]};
    const tree = renderWithContext(<BuildingDetail index={0} goBack={jest.fn()} />, {state});
    const scroll = tree.root.findByProps({testID: 'detail-scroll'});
    expect(scroll).toBeTruthy();
  });
});
