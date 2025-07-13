import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useGame} from '../context/GameContext';
import GPU_TYPES from '../constants/gpuTypes';
import POWER_TIERS from '../constants/powerTiers';
import {
  buyGPU as buyGPUAction,
  upgradeCooling as upgradeCoolingAction,
  upgradePower as upgradePowerAction,
} from '../utils/gameActions';

export default function BuildingDetail({index, goBack}) {
  const {state, setState} = useGame();
  const b = state.buildings[index];

  const buyGPU = gpuType => {
    setState(s => buyGPUAction(s, index, gpuType));
  };

  const upgradeCooling = () => {
    setState(s => upgradeCoolingAction(s, index));
  };

  const upgradePower = () => {
    setState(s => upgradePowerAction(s, index));
  };

  const earnings = b.gpuCounts.reduce(
    (sum, c, i) => sum + c * GPU_TYPES[i].income,
    0,
  );

  return (
    <View style={styles.detailContainer}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.detailTitle}>{b.size.label} #{index + 1}</Text>
      <Text style={styles.earnings}>Earnings: ${earnings.toFixed(1)}/sec</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Capacity:</Text>
        <Text style={styles.value}>{b.size.capacity}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                b.throttleState === 'Green'
                  ? '#38D39F'
                  : b.throttleState === 'Yellow'
                  ? '#F5A623'
                  : '#FF4C4C',
            },
          ]}>
          <Text style={styles.badgeText}>{b.throttleState}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Heat:</Text>
        <Text style={styles.value}>{b.currentHeat.toFixed(1)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Power Draw:</Text>
        <Text style={styles.value}>{b.currentPowerDraw.toFixed(1)} kW/s</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Power Cost:</Text>
        <Text style={styles.value}>${b.currentPowerCost.toFixed(2)}/s</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tier:</Text>
        <View style={[styles.badge, {backgroundColor: '#007AFF'}]}>
          <Text style={styles.badgeText}>
            {POWER_TIERS[b.power.tier].label}
          </Text>
        </View>
      </View>
      {GPU_TYPES.map((t, i) => (
        <View key={i} style={styles.gpuSection}>
          <View style={styles.row}>
            <Text style={styles.label}>{t.label}:</Text>
            <Text style={styles.value}>
              x{b.gpuCounts[i]} @ {t.income}/sec each
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => buyGPU(i)}
            style={styles.actionButton}
            disabled={state.money < t.cost}>
            <Text style={styles.buttonText}>Buy (${t.cost})</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        onPress={upgradeCooling}
        style={[styles.actionButton, styles.coolButton]}>
        <Text style={styles.buttonText}>
          Upgrade Cooling (${b.cooling.costs[b.cooling.tier]})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={upgradePower}
        style={[styles.actionButton, styles.powerButton]}
        disabled={b.power.tier >= b.power.costs.length - 1}>
        <Text style={styles.buttonText}>
          Upgrade Power ({`$${b.power.costs[b.power.tier + 1] || '-'}`})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  detailContainer: {flex: 1, padding: 16, backgroundColor: '#1E1E1E'},
  backButton: {marginBottom: 16},
  backText: {color: '#007AFF', fontSize: 16},
  detailTitle: {fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 16},
  earnings: {color: '#A6E22E', fontSize: 16, marginBottom: 12},
  gpuSection: {marginBottom: 12},
  row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
  label: {color: '#CCC', fontSize: 14},
  value: {color: '#FFF', fontSize: 14, fontWeight: '500'},
  actionButton: {backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 8},
  coolButton: {backgroundColor: '#FF9500'},
  powerButton: {backgroundColor: '#5856D6'},
  buttonText: {color: '#FFF', fontSize: 16, fontWeight: '600'},
  badge: {borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4},
  badgeText: {color: '#FFF', fontSize: 12, fontWeight: 'bold'},
});
