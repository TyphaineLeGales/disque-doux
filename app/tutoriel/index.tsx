import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Tutorial } from '@/components/Tutorial';
import { useUserStore } from '@/stores/userStore';

export default function TutorialScreen() {
  const router = useRouter();
  const { unsetIsFirstTime } = useUserStore();
  
  const onBtnPress = () => {
    unsetIsFirstTime();
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView>
      <Tutorial />
      <View className="w-[100%] items-center justify-center">
        <Button onPress={onBtnPress} title="Complete tutorial" />
      </View>
    </SafeAreaView>
  );
}
