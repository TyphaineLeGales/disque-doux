import { Slot } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DebugPanel } from '@/components/ui/DebugPanel';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex size-full flex-1 items-center justify-center bg-white">
      <DebugPanel />
      <Slot />
    </SafeAreaView>
  );
}
