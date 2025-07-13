// App.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar, Platform } from 'react-native';

// --- Game Context ---
const GameContext = createContext();
export const useGame = () => useContext(GameContext);

// --- Building Size Presets ---
const SIZE_PRESETS = [
  { label: 'Small (10 racks)', capacity: 10, costMultiplier: 1, purchaseCost: 1000 },
  { label: 'Medium (100 racks)', capacity: 100, costMultiplier: 3, purchaseCost: 10000 },
  { label: 'Large (1k racks)', capacity: 1000, costMultiplier: 5, purchaseCost: 100000 },
  { label: 'Mega (10k racks)', capacity: 10000, costMultiplier: 7, purchaseCost: 1000000 },
];

// --- Initial State ---
const initialState = {
  money: SIZE_PRESETS[0].purchaseCost + 2 * (100 * Math.pow(2, SIZE_PRESETS[0].costMultiplier)),
  buildings: [],
};

export default function App() {
  const [state, setState] = useState(initialState);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // Idle income timer
  useEffect(() => {
    const interval = setInterval(() => {
      const income = state.buildings.reduce((sum, b) => sum + b.incomePerTick, 0);
      setState(s => ({ ...s, money: s.money + income }));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.buildings]);

  const goBack = () => setSelectedBuilding(null);

  return (
    <GameContext.Provider value={{ state, setState, setSelectedBuilding }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Data Center Simulator</Text>
          <Text style={styles.money}>${state.money.toFixed(2)}</Text>
        </View>
        {selectedBuilding !== null ? (
          <BuildingDetail index={selectedBuilding} goBack={goBack} />
        ) : (
          <>
            <FlatList
              contentContainerStyle={styles.list}
              data={state.buildings}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item, index }) => <BuildingItem building={item} index={index} />}
            />
            <AddBuildingButton />
          </>
        )}
      </SafeAreaView>
    </GameContext.Provider>
  );
}

function BuildingItem({ building, index }) {
  const { setSelectedBuilding } = useGame();
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
        <View style={[styles.badge, { backgroundColor: color }]}>          
          <Text style={styles.badgeText}>{['Evap', 'Liquid', 'Nitro'][building.cooling.tier]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function BuildingDetail({ index, goBack }) {
  const { state, setState } = useGame();
  const b = state.buildings[index];

  const buyGPU = () => {
    if (state.money >= b.gpuCost && b.gpus < b.size.capacity) {
      const updated = [...state.buildings];
      updated[index].gpus += 1;
      updated[index].incomePerTick += b.gpuIncome;
      setState(s => ({ ...s, money: s.money - b.gpuCost, buildings: updated }));
    }
  };

  const upgradeCooling = () => {
    const { tier, costs } = b.cooling;
    if (tier < costs.length - 1 && state.money >= costs[tier]) {
      const updated = [...state.buildings];
      updated[index].cooling.tier += 1;
      setState(s => ({ ...s, money: s.money - costs[tier], buildings: updated }));
    }
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

function AddBuildingButton() {
  const { state, setState } = useGame();
  const [showOptions, setShowOptions] = useState(false);

  const add = preset => {
    if (state.money >= preset.purchaseCost) {
      const newB = {
        size: preset,
        gpus: 0,
        gpuCost: 100 * Math.pow(2, preset.costMultiplier),
        gpuIncome: 1,
        incomePerTick: 0,
        cooling: { tier: 0, costs: [500 * preset.costMultiplier, 2000 * preset.costMultiplier, 10000 * preset.costMultiplier] },
      };
      setState(s => ({ ...s, money: s.money - preset.purchaseCost, buildings: [...s.buildings, newB] }));
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
  safeArea: { flex: 1, backgroundColor: '#1E1E1E', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  headerContainer: { padding: 16, backgroundColor: '#252526', borderBottomWidth: 1, borderBottomColor: '#3C3C3C' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  money: { marginTop: 4, fontSize: 20, color: '#A6E22E' },
  list: { padding: 16 },
  card: { backgroundColor: '#292929', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#FFF', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#CCC', fontSize: 14 },
  value: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  detailContainer: { flex: 1, padding: 16, backgroundColor: '#1E1E1E' },
  backButton: { marginBottom: 16 },
  backText: { color: '#007AFF', fontSize: 16 },
  detailTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', marginBottom: 16 },
  actionButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 8 },
  coolButton: { backgroundColor: '#FF9500' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  sizeContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', margin: 16 },
  sizeButton: { backgroundColor: '#50E3C2', padding: 12, borderRadius: 8, margin: 4, flexGrow: 1, alignItems: 'center' },
  sizeText: { color: '#1E1E1E', fontSize: 12, fontWeight: '600' },
  cancelButton: { marginTop: 8, alignItems: 'center' },
  cancelText: { color: '#FF3B30', fontSize: 16 },
  buyButton: { margin: 16, backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 24, alignItems: 'center' },
  buyText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
