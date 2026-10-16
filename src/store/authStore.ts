import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiUser } from "../models";

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  login: (token: string, user: ApiUser) => void;
  logout: () => void;
}

// persist keeps the JWT and user in localStorage, so a reload restores
// the session; logout clears both from the store and from localStorage.
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
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
