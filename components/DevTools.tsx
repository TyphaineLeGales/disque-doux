import { Button, View } from 'react-native';
import { useUserStore } from '@/stores/userStore';

export const DevTools = () => {
  const reset = useUserStore((state) => state.reset);
  
  return (
    <View className="absolute bottom-20 right-4">
      <Button title="Reset Store" onPress={reset} />
    </View>
  );
}; 