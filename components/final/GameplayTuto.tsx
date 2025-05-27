import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

type GameplayTutoProps = {
  onDone: Function;
  id: string;
  debug?: boolean;
};

export default function GameTuto(props: GameplayTutoProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onDone();
    }, 3000);

    return () => clearTimeout(timer);
  }, [props.onDone]);

  return (
    <View className="absolute inset-0 z-[4] h-screen w-screen items-center justify-center bg-[#FFE8E0]">
      <Text className="text-2xl font-bold">Tutoriel</Text>
    </View>
  );
}
