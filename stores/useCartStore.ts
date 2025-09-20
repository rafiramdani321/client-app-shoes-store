import { create } from "zustand";

interface CartSidebarProps {
  collapsed: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const useCartSideBar = create<CartSidebarProps>((set) => ({
  collapsed: true,
  onExpand: () => set(() => ({ collapsed: false })),
  onCollapse: () => set(() => ({ collapsed: true })),
}));
