import { Slot } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { DebugPanel } from '@/components/ui/DebugPanel';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex size-full flex-1 items-center justify-center bg-white">
      {/* <DebugPanel /> */}
      <Slot />
    </View>
  );
}
