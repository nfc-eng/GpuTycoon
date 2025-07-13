import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, useColorScheme} from 'react-native';
import {useGame} from '../context/GameContext';
import GPU_TYPES from '../constants/gpuTypes';
import {palette, accent} from '../constants/theme';
import POWER_TIERS from '../constants/powerTiers';
import {
  buyGPU as buyGPUAction,
  sellGPU as sellGPUAction,
  upgradeCooling as upgradeCoolingAction,
  upgradePower as upgradePowerAction,
  downgradePower as downgradePowerAction,
} from '../utils/gameActions';

export default function BuildingDetail({index, goBack}) {
  const {state, setState} = useGame();
  const scheme = useColorScheme();
  const colors = palette[scheme] || palette.dark;
  const styles = getStyles(colors);
  const b = state.buildings[index];

  const buyGPU = gpuType => {
    setState(s => buyGPUAction(s, index, gpuType));
  };

  const sellGPU = gpuType => {
    setState(s => sellGPUAction(s, index, gpuType));
  };

  const upgradeCooling = () => {
    setState(s => upgradeCoolingAction(s, index));
  };

  const upgradePower = () => {
    setState(s => upgradePowerAction(s, index));
  };

  const downgradePower = () => {
    setState(s => downgradePowerAction(s, index));
  };

  const earnings = b.gpuCounts.reduce(
    (sum, c, i) => sum + c * GPU_TYPES[i].income,
    0,
  );
  const usedRacks = b.gpuCounts.reduce((sum, c) => sum + c, 0);

  return (
    <ScrollView contentContainerStyle={styles.detailContainer} testID="detail-scroll">
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
        <Text style={styles.label}>Racks Used:</Text>
        <Text style={styles.value}>
          {usedRacks} / {b.size.capacity}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                b.throttleState === 'Green'
                  ? accent.success
                  : b.throttleState === 'Yellow'
                  ? accent.warning
                  : accent.error,
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
        <Text style={styles.value}>{POWER_TIERS[b.power.tier].label}</Text>
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
          <TouchableOpacity
            onPress={() => sellGPU(i)}
            style={[styles.actionButton, styles.sellButton]}
            disabled={b.gpuCounts[i] === 0}>
            <Text style={styles.buttonText}>Sell (+${t.cost / 2})</Text>
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
        style={[styles.actionButton, styles.coolButton]}>
        <Text style={styles.buttonText}>
          Upgrade Power (${POWER_TIERS[b.power.tier + 1] ? POWER_TIERS[b.power.tier + 1].purchaseCost : 'MAX'})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={downgradePower}
        style={[styles.actionButton, styles.sellButton]}
        disabled={b.power.tier === 0}>
        <Text style={styles.buttonText}>
          Downgrade Power (+${POWER_TIERS[b.power.tier].purchaseCost / 2})
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = c =>
  StyleSheet.create({
    detailContainer: {flex: 1, padding: 16, backgroundColor: c.background},
    backButton: {marginBottom: 16},
    backText: {color: accent.primary, fontSize: 16},
    detailTitle: {fontSize: 22, fontWeight: '700', color: c.textPrimary, marginBottom: 16},
    earnings: {color: accent.success, fontSize: 16, marginBottom: 12},
    gpuSection: {marginBottom: 12},
    row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
    label: {color: c.textSecondary, fontSize: 14},
    value: {color: c.textPrimary, fontSize: 14, fontWeight: '500'},
    actionButton: {backgroundColor: accent.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 8},
    coolButton: {backgroundColor: accent.warning},
    sellButton: {backgroundColor: accent.error},
    buttonText: {color: '#FFF', fontSize: 16, fontWeight: '600'},
    badge: {borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4},
    badgeText: {color: '#FFF', fontSize: 12, fontWeight: 'bold'},
  });
