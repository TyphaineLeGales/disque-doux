import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { Dimensions, View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
export default function Wiggle() {
  return (
    <View className="h-full w-full flex-1">
      <Text>Wiggle</Text>
    </View>
  );
}
