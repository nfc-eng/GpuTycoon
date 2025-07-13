import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useGame} from '../context/GameContext';
import {buyGPU as buyGPUAction, upgradeCooling as upgradeCoolingAction} from '../utils/gameActions';

export default function BuildingDetail({index, goBack}) {
  const {state, setState} = useGame();
  const b = state.buildings[index];

  const buyGPU = () => {
    setState(s => buyGPUAction(s, index));
  };

  const upgradeCooling = () => {
    setState(s => upgradeCoolingAction(s, index));
  };

  return (
    <View style={styles.detailContainer}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.detailTitle}>{b.size.label} #{index + 1}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Capacity:</Text>
        <Text style={styles.value}>{b.size.capacity}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>GPUs:</Text>
        <Text style={styles.value}>{b.gpus}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Income/tick:</Text>
        <Text style={styles.value}>{b.incomePerTick.toFixed(1)}</Text>
      </View>
      <TouchableOpacity onPress={buyGPU} style={styles.actionButton}>
        <Text style={styles.buttonText}>Buy GPU (${b.gpuCost})</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={upgradeCooling} style={[styles.actionButton, styles.coolButton]}>
        <Text style={styles.buttonText}>Upgrade Cooling (${b.cooling.costs[b.cooling.tier]})</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  detailContainer: {flex: 1, padding: 16, backgroundColor: '#1E1E1E'},
  backButton: {marginBottom: 16},
  backText: {color: '#007AFF', fontSize: 16},
  detailTitle: {fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 16},
  row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
  label: {color: '#CCC', fontSize: 14},
  value: {color: '#FFF', fontSize: 14, fontWeight: '500'},
  actionButton: {backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 8},
  coolButton: {backgroundColor: '#FF9500'},
  buttonText: {color: '#FFF', fontSize: 16, fontWeight: '600'},
});
