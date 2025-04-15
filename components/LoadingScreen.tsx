import React from 'react';
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

type LoadingProps = {
  progressValue: number;
};

export const LoadingScreen = (props: LoadingProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="py-2 text-xl font-bold uppercase ">Loading ... </Text>
      <Progress.Bar progress={props.progressValue} width={200} color="rgba(0, 122, 255, 1)" />
    </View>
  );
};
