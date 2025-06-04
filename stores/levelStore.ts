import { create } from 'zustand';

type LevelStore = {
  debugMode: boolean;
  level: number;
  phaseIndex: number;
  setLevel: (val: number) => void;
  setPhaseIndex: (index: number) => void;
};

export const useLevelStore = create<LevelStore>((set) => ({
  debugMode: true,
  level: 0,
  phaseIndex: 0,
  setLevel: (val) => set({ level: val }),
  setPhaseIndex: (index) => {
    set({ phaseIndex: index });
    console.log('in store phase is set to', index);
  },
}));
