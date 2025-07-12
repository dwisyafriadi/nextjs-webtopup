import { create } from "zustand";

interface UserState {
  balance: number;
  isRefreshing: boolean;

  // Actions
  setBalance: (balance: number) => void;
  refreshBalance: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  balance: 0,
  isRefreshing: false,

  setBalance: (balance: number) => set({ balance }),

  refreshBalance: async () => {
    set({ isRefreshing: true });
    try {
      const response = await apiRequest<{ balance: { balance: number } }>(
        "/user/balance"
      );
      set({ balance: response.balance.balance });
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    } finally {
      set({ isRefreshing: false });
    }
  },
}));
