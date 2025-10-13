import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthTokenState {
  bearerToken: string | null;
  setBearerToken: (bearerToken: string) => void;
  clearBearerToken: () => void;
}

export const useAuthToken = create<AuthTokenState>()(
  persist(
    (set) => ({
      bearerToken: null,
      setBearerToken: (bearerToken) => set({ bearerToken }),
      clearBearerToken: () => set({ bearerToken: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
