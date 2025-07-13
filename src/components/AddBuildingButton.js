import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useGame} from '../context/GameContext';
import SIZE_PRESETS from '../constants/sizePresets';

export default function AddBuildingButton() {
  const {state, setState} = useGame();
  const [showOptions, setShowOptions] = useState(false);

  const add = preset => {
    if (state.money >= preset.purchaseCost) {
      const newB = {
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
      setState(s => ({...s, money: s.money - preset.purchaseCost, buildings: [...s.buildings, newB]}));
      setShowOptions(false);
    }
  };

  return showOptions ? (
    <View style={styles.sizeContainer}>
      {SIZE_PRESETS.map((preset, i) => (
        <TouchableOpacity key={i} onPress={() => add(preset)} style={styles.sizeButton}>
          <Text style={styles.sizeText}>{preset.label} (${preset.purchaseCost})</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() => setShowOptions(false)} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity onPress={() => setShowOptions(true)} style={styles.buyButton}>
      <Text style={styles.buyText}>Buy Building</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sizeContainer: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', margin: 16},
  sizeButton: {backgroundColor: '#50E3C2', padding: 12, borderRadius: 8, margin: 4, flexGrow: 1, alignItems: 'center'},
  sizeText: {color: '#1E1E1E', fontSize: 12, fontWeight: '600'},
  cancelButton: {marginTop: 8, alignItems: 'center'},
  cancelText: {color: '#FF3B30', fontSize: 16},
  buyButton: {margin: 16, backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 24, alignItems: 'center'},
  buyText: {color: '#FFF', fontSize: 16, fontWeight: '700'},
});
