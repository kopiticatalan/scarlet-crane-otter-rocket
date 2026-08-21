import { create } from "zustand";

type UiState = {
  addOpen: boolean;
  scanProgress: string;
  openAdd: () => void;
  closeAdd: () => void;
  setScanProgress: (s: string) => void;
};

export const useUi = create<UiState>((set) => ({
  addOpen: false,
  scanProgress: "",
  openAdd: () => set({ addOpen: true }),
  closeAdd: () => set({ addOpen: false }),
  setScanProgress: (scanProgress) => set({ scanProgress }),
}));
