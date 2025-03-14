import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
  levelCompleted: number;
  isFirstTime: boolean;
  completeLevel: (qty: number) => void;
  unsetIsFirstTime: () => void;
};

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      levelCompleted: 0,
      isFirstTime: true,
      completeLevel: (qty: number) =>
        set((state) => ({ levelCompleted: state.levelCompleted + qty })),
      unsetIsFirstTime: () => set(() => ({ isFirstTime: false })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
