import Slider from '@react-native-community/slider';
import { View, Text, Switch, StyleSheet } from 'react-native';

import { useLevelStore } from './store';

export const DebugPanel = () => {
  const { level, setLevel, debugMode } = useLevelStore();

  if (!debugMode) return null;

  return (
    <View style={styles.panel}>
      <Text style={styles.label}>Level: {level.toFixed(1)}</Text>
      <Slider
        style={{ width: 150 }}
        minimumValue={0}
        maximumValue={10}
        step={0.1}
        value={level}
        onValueChange={setLevel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#000000aa',
    padding: 10,
    borderRadius: 10,
  },
  label: {
    color: 'white',
    marginBottom: 4,
  },
});
