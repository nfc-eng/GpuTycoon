import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet, useColorScheme} from 'react-native';
import {useGame} from '../context/GameContext';
import {palette, accent} from '../constants/theme';

export default function BuildingItem({building, index}) {
  const {setSelectedBuilding} = useGame();
  const scheme = useColorScheme();
  const colors = palette[scheme] || palette.dark;
  const styles = getStyles(colors);
  const throttleColors = {
    Green: accent.success,
    Yellow: accent.warning,
    Red: accent.error,
  };
  const color = throttleColors[building.throttleState] || accent.success;
  const totalGpus = building.gpuCounts.reduce((sum, c) => sum + c, 0);

  return (
    <TouchableOpacity onPress={() => setSelectedBuilding(index)} style={styles.card}>
      <Text style={styles.cardTitle}>
        {building.size.label} #{index + 1}
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Capacity:</Text>
        <Text style={styles.value}>{building.size.capacity}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>GPUs:</Text>
        <Text style={styles.value}>{totalGpus}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <View style={[styles.badge, {backgroundColor: color}]}>
          <Text style={styles.badgeText}>{building.throttleState}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Heat:</Text>
        <Text style={styles.value}>{building.currentHeat.toFixed(1)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Power:</Text>
        <Text style={styles.value}>
          {building.currentPowerDraw.toFixed(1)} kW @{' '}
          {building.power.tier + 1}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = c =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    cardTitle: {fontSize: 18, fontWeight: '600', color: c.textPrimary, marginBottom: 8},
    row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
    label: {color: c.textSecondary, fontSize: 14},
    value: {color: c.textPrimary, fontSize: 14, fontWeight: '500'},
    badge: {borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4},
    badgeText: {color: '#FFF', fontSize: 12, fontWeight: 'bold'},
  });
