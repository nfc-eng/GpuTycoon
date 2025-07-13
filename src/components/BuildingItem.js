import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {useGame} from '../context/GameContext';

export default function BuildingItem({building, index}) {
  const {setSelectedBuilding} = useGame();
  const color = ['#38D39F', '#F5A623', '#FF4C4C'][building.cooling.tier] || '#38D39F';

  return (
    <TouchableOpacity onPress={() => setSelectedBuilding(index)} style={styles.card}>
      <Text style={styles.cardTitle}>{building.size.label} #{index + 1}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Capacity:</Text>
        <Text style={styles.value}>{building.size.capacity}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>GPUs:</Text>
        <Text style={styles.value}>{building.gpus}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cooling:</Text>
        <View style={[styles.badge, {backgroundColor: color}]}>
          <Text style={styles.badgeText}>{['Evap', 'Liquid', 'Nitro'][building.cooling.tier]}</Text>
        </View>
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
