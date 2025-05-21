import { Slot } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DebugPanel } from '@/components/DebugPanel';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex size-full items-center justify-center bg-slate-800">
      {/* <DebugPanel /> */}
      <Slot />
    </SafeAreaView>
  );
}
