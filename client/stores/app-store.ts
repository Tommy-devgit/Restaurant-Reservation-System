import { create } from "zustand";

type AppState = {
  selectedRestaurantId: string;
  setSelectedRestaurantId: (id: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  selectedRestaurantId: "",
  setSelectedRestaurantId: (id) => set({ selectedRestaurantId: id }),
}));
