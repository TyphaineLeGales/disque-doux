import { Text, View } from 'react-native';
import Rive from 'rive-react-native';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className={styles.title}>{title}</Text>
      <View className="my-7 h-[2px] w-4/5 bg-slate-600" />
      <Rive
        url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
        artboardName="Avatar 1"
        stateMachineName="avatar"
        style={{ width: 400, height: 400 }}
      />
      {children}
    </View>
  );
};
const styles = {
  title: `text-xl font-bold`,
};
