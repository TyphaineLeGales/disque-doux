import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';

import { useLevelStore } from '../stores/levelStore';

export const DebugPanel = () => {
  const { phaseIndex, setPhaseIndex, debugMode, level } = useLevelStore();
  const [inputValue, setInputValue] = useState(0);
  const router = useRouter();
  const updatePhase = () => {
    // eslint-disable-next-line radix
    const numericValue = parseInt(inputValue);
    if (!isNaN(numericValue)) {
      setPhaseIndex(numericValue);
    }
  };

  const goToLevel = () => {
    router.push(`/level/${level}`);
  };

  if (!debugMode) return null;
  const handleChange = (text: string) => {
    setInputValue(text);
    const numericValue = parseFloat(text);
    if (!isNaN(numericValue)) {
      setInputValue(numericValue);
    }
  };

  return (
    <View style={styles.panel}>
      <View className="flex flex-row">
        <Button title="Go to phase" onPress={updatePhase} color="white" />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={inputValue}
          onChangeText={handleChange}
        />
      </View>
      <Button title="Jump to Level" onPress={goToLevel} color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    zIndex: 200,
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
  input: {
    width: 25,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    textAlign: 'center',
  },
});
