import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {useGame} from '../context/GameContext';

export default function BuildingItem({building, index}) {
  const {setSelectedBuilding} = useGame();
  const throttleColors = {Green: '#38D39F', Yellow: '#F5A623', Red: '#FF4C4C'};
  const color = throttleColors[building.throttleState] || '#38D39F';
  const totalGpus = building.gpuCounts.reduce((sum, c) => sum + c, 0);

  return (
    <TouchableOpacity onPress={() => setSelectedBuilding(index)} style={styles.card}>
      <Text style={styles.cardTitle}>{building.size.label} #{index + 1}</Text>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#292929',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 8},
  row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
  label: {color: '#CCC', fontSize: 14},
  value: {color: '#FFF', fontSize: 14, fontWeight: '500'},
  badge: {borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4},
  badgeText: {color: '#FFF', fontSize: 12, fontWeight: 'bold'},
});
