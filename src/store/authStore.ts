import { create } from "zustand";
import type { User } from "../models";

interface AuthState {
  token: string | null;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (user) => set({ token: `demo-token-${user.id}`, user }),
  logout: () => set({ token: null, user: null }),
}));

export default useAuthStore;
