import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiUser } from "../models";

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  login: (user: ApiUser) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (user) => set({ token: `demo-token-${user.id}`, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "itelect4-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
