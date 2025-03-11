import { Text, View, SafeAreaView } from 'react-native';
import Rive from 'rive-react-native';

export default function test() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-200">
      <Text className="pt-4 text-xl font-bold uppercase">remote url resource</Text>
      <View className="my-7 h-[2px] w-4/5 bg-slate-600" />
      <Rive
        url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
        artboardName="Avatar 1"
        stateMachineName="avatar"
        style={{ width: 400, height: 400 }}
      />
    </SafeAreaView>
  );
}
