import { UserDecodedPayload } from "@/types/user.type";
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  isAuthResolved: boolean;
  user: UserDecodedPayload | null;
  setAccessToken: (token: string) => void;
  setUser: (user: UserDecodedPayload | null) => void;
  setAuthResolved: (value: boolean) => void;
  clearAccessToken: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthResolved: false,
  user: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setAuthResolved: (value) => set({ isAuthResolved: value }),
  clearAccessToken: () => set({ accessToken: null, user: null }),
}));
