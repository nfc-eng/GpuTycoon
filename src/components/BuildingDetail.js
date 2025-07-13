import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useGame} from '../context/GameContext';
import GPU_TYPES from '../constants/gpuTypes';
import {palette, accent} from '../constants/theme';
import POWER_TIERS from '../constants/powerTiers';
import COOLING_CAPACITY from '../constants/coolingTiers';
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
  const ProgressBar = ({progress, color}) => (
    <View style={styles.progressBg}>
      <View
        style={[
          styles.progressFill,
          {width: `${Math.min(progress, 1) * 100}%`, backgroundColor: color},
        ]}
      />
    </View>
  );
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
  const throttleColor =
    b.throttleState === 'Green'
      ? accent.success
      : b.throttleState === 'Yellow'
      ? accent.warning
      : accent.error;

  const stats = [
    {
      label: 'Capacity',
      icon: 'server',
      value: b.size.capacity,
    },
    {
      label: 'Racks Used',
      icon: 'archive-check',
      value: `${usedRacks} / ${b.size.capacity}`,
      progress: usedRacks / b.size.capacity,
    },
    {
      label: 'Status',
      icon: 'traffic-light',
      badge: true,
      badgeColor: throttleColor,
      value: b.throttleState,
    },
    {
      label: 'Heat',
      icon: 'thermometer',
      value: b.currentHeat.toFixed(1),
      progress:
        COOLING_CAPACITY[b.cooling.tier]
          ? b.currentHeat / COOLING_CAPACITY[b.cooling.tier]
          : 0,
    },
    {
      label: 'Power Draw',
      icon: 'flash',
      value: `${b.currentPowerDraw.toFixed(1)} kW/s`,
    },
    {
      label: 'Power Cost',
      icon: 'currency-usd',
      value: `$${b.currentPowerCost.toFixed(2)}/s`,
    },
    {
      label: 'Tier',
      icon: 'battery',
      value: POWER_TIERS[b.power.tier].label,
    },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        contentContainerStyle={styles.detailContainer}
        testID="detail-scroll">
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>{b.size.label} #{index + 1}</Text>
        <Text style={styles.earnings}>Earnings: ${earnings.toFixed(1)}/sec</Text>
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statItem}>
              <View style={styles.statLabelRow}>
                {s.icon && (
                  <MaterialCommunityIcons
                    name={s.icon}
                    size={14}
                    color={colors.icon}
                    style={{marginRight: 4}}
                  />
                )}
                <Text style={styles.label}>{s.label}</Text>
              </View>
              {s.badge ? (
                <View style={[styles.badge, {backgroundColor: s.badgeColor}]}>
                  <Text style={styles.badgeText}>{s.value}</Text>
                </View>
              ) : (
                <Text style={styles.value}>{s.value}</Text>
              )}
              {s.progress !== undefined && (
                <ProgressBar
                  progress={s.progress}
                  color={s.badge ? s.badgeColor : accent.primary}
                />
              )}
            </View>
          ))}
        </View>
      {GPU_TYPES.map((t, i) => (
        <View key={i} style={styles.gpuCard}>
          <MaterialCommunityIcons
            name="chip"
            size={20}
            color={colors.icon}
            style={{marginRight: 8}}
          />
          <Text style={styles.gpuLabel}>{t.label}</Text>
          <Text style={styles.gpuCount}>
            x{b.gpuCounts[i]} @{t.income}/sec
          </Text>
          <TouchableOpacity
            onPress={() => buyGPU(i)}
            style={styles.smallButton}
            disabled={state.money < t.cost}>
            <Text style={styles.smallButtonText}>Buy ${t.cost}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => sellGPU(i)}
            style={[styles.smallButton, styles.sellButton]}
            disabled={b.gpuCounts[i] === 0}>
            <Text style={styles.smallButtonText}>-</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={{height: 160}} />
    </ScrollView>
      <View style={styles.footer}>
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
            Upgrade Power (
            {POWER_TIERS[b.power.tier + 1]
              ? POWER_TIERS[b.power.tier + 1].purchaseCost
              : 'MAX'})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={downgradePower}
          style={[styles.actionButton, styles.sellButton]}
          disabled={b.power.tier === 0}>
          <Text style={styles.buttonText}>
            Downgrade Power (+{POWER_TIERS[b.power.tier].purchaseCost / 2})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = c =>
  StyleSheet.create({
    safeContainer: {flex: 1, backgroundColor: c.background},
    detailContainer: {padding: 16, paddingBottom: 200},
    backButton: {marginBottom: 16},
    backText: {color: accent.primary, fontSize: 16},
    detailTitle: {fontSize: 22, fontWeight: '700', color: c.textPrimary, marginBottom: 16},
    earnings: {color: accent.success, fontSize: 16, marginBottom: 12},
    statsGrid: {flexDirection: 'row', flexWrap: 'wrap'},
    statItem: {width: '50%', paddingVertical: 8},
    statLabelRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 4},
    label: {color: c.textSecondary, fontSize: 14},
    value: {color: c.textPrimary, fontSize: 14, fontWeight: '500'},
    progressBg: {height: 6, backgroundColor: c.divider, borderRadius: 3, overflow: 'hidden', marginTop: 4},
    progressFill: {height: 6},
    gpuCard: {flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: c.secondarySurface, borderRadius: 12, marginBottom: 8},
    gpuLabel: {color: c.textPrimary, fontSize: 14, flexShrink: 1},
    gpuCount: {marginLeft: 4, color: c.textSecondary, fontSize: 12},
    smallButton: {backgroundColor: accent.primary, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6, marginLeft: 8},
    smallButtonText: {color: '#FFF', fontSize: 12, fontWeight: '600'},
    actionButton: {backgroundColor: accent.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 4},
    coolButton: {backgroundColor: accent.warning},
    sellButton: {backgroundColor: accent.error},
    buttonText: {color: '#FFF', fontSize: 16, fontWeight: '600'},
    footer: {position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: c.secondarySurface},
    badge: {borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4},
    badgeText: {color: '#FFF', fontSize: 12, fontWeight: 'bold'},
  });
