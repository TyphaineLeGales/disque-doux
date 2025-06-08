import { create } from 'zustand';

type LevelStore = {
  debugMode: boolean;
  level: number;
  phaseIndex: number;
  setLevel: (val: number) => void;
  setPhaseIndex: (index: number) => void;
  hideProgressBar: boolean;
  setHideProgressBar: (val: boolean) => void;
};

export const useLevelStore = create<LevelStore>((set) => ({
  debugMode: true,
  hideProgressBar: false,
  setHideProgressBar: (val) => set({ hideProgressBar: val }),
  level: 0,
  phaseIndex: 3,
  setLevel: (val) => set({ level: val }),
  setPhaseIndex: (index) => {
    set({ phaseIndex: index });
    console.log('in store phase is set to', index);
  },
}));
