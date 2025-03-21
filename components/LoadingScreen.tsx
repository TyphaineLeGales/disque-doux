import React from 'react';
import { Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoadingProps = {
  progressValue: number;
};

export const LoadingScreen = (props: LoadingProps) => {
  return (
    <SafeAreaView className="items-center justify-center flex-1">
      <Text className="py-2 text-xl font-bold uppercase ">Loading ... </Text>
      <Progress.Bar progress={props.progressValue} width={200} color="rgba(0, 122, 255, 1)" />
    </SafeAreaView>
  );
};
