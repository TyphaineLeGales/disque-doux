import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Text, View, Button } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';

export default function Sequence() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const onNext = () => router.push('/level/' + id);
  const riveComponentRef = useRef<RiveRef>(null);
  const handleStateChange = (stateMachineName: string, stateName: string) => {
    if (stateName === 'out') {
      setTimeout(onNext, 1000);
    }
  };

  return (
    <View className="size-full bg-[#FFE8E0]">
      {/* <Text className="text-xl font-bold">séquence de narration : {id}</Text> */}
      <Rive
        ref={riveComponentRef}
        resourceName="narration_1_2" // use id to get proper rive file
        fit={Fit.Cover}
        style={{
          width: '100%',
          height: '90%',
        }}
        onStateChanged={handleStateChange}
      />
      {/* <View className="flex w-full flex-row items-center justify-center">
        <Button title="find tools" onPress={onNext} />
      </View> */}
    </View>
  );
}
