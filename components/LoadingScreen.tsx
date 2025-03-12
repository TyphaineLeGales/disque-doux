import { Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoadingProps = {
  progressValue: number;
};

export const LoadingScreen = (props: LoadingProps) => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-200">
      <Text className="py-2 text-xl font-bold uppercase ">Loading ... </Text>
      <Progress.Bar progress={props.progressValue} width={200} />
    </SafeAreaView>
  );
};
