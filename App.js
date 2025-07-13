import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, FlatList, StatusBar, StyleSheet, Platform} from 'react-native';
import GameContext from './src/context/GameContext';
import SIZE_PRESETS from './src/constants/sizePresets';
import BuildingItem from './src/components/BuildingItem';
import BuildingDetail from './src/components/BuildingDetail';
import AddBuildingButton from './src/components/AddBuildingButton';

const initialState = {
  money: SIZE_PRESETS[0].purchaseCost + 2 * (100 * Math.pow(2, SIZE_PRESETS[0].costMultiplier)),
  buildings: [],
};

export default function App() {
  const [state, setState] = useState(initialState);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const income = state.buildings.reduce((sum, b) => sum + b.incomePerTick, 0);
      setState(s => ({...s, money: s.money + income}));
    }, 1000);
    return () => clearInterval(interval);
  }, [state.buildings]);

  const goBack = () => setSelectedBuilding(null);

  return (
    <GameContext.Provider value={{state, setState, setSelectedBuilding}}>
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
              renderItem={({item, index}) => (
                <BuildingItem building={item} index={index} />
              )}
            />
            <AddBuildingButton />
          </>
        )}
      </SafeAreaView>
    </GameContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#1E1E1E', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0},
  headerContainer: {padding: 16, backgroundColor: '#252526', borderBottomWidth: 1, borderBottomColor: '#3C3C3C'},
  header: {fontSize: 28, fontWeight: 'bold', color: '#FFF'},
  money: {marginTop: 4, fontSize: 20, color: '#A6E22E'},
  list: {padding: 16},
});
