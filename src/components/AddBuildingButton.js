import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, useColorScheme} from 'react-native';
import {useGame} from '../context/GameContext';
import SIZE_PRESETS from '../constants/sizePresets';
import {addBuilding} from '../utils/gameActions';
import {palette, accent} from '../constants/theme';

export default function AddBuildingButton() {
  const {state, setState} = useGame();
  const [showOptions, setShowOptions] = useState(false);
  const scheme = useColorScheme();
  const colors = palette[scheme] || palette.dark;
  const styles = getStyles(colors);

  const add = preset => {
    if (state.money >= preset.purchaseCost) {
      setState(s => addBuilding(s, preset));
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

const getStyles = c =>
  StyleSheet.create({
    sizeContainer: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', margin: 16},
    sizeButton: {backgroundColor: accent.secondary, padding: 12, borderRadius: 8, margin: 4, flexGrow: 1, alignItems: 'center'},
    sizeText: {color: c.textPrimary, fontSize: 12, fontWeight: '600'},
    cancelButton: {marginTop: 8, alignItems: 'center'},
    cancelText: {color: accent.error, fontSize: 16},
    buyButton: {margin: 16, backgroundColor: accent.primary, paddingVertical: 14, borderRadius: 24, alignItems: 'center'},
    buyText: {color: '#FFF', fontSize: 16, fontWeight: '700'},
  });
