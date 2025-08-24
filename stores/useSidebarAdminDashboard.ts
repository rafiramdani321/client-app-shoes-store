// store/useSidebarAdminDashboard.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  onCollapse: () => void;
  onExpand: () => void;
}

export const useSidebarAdminDashboard = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false, // default
      setCollapsed: (value) => set({ collapsed: value }),
      onCollapse: () => set({ collapsed: true }),
      onExpand: () => set({ collapsed: false }),
    }),
    {
      name: "sidebar-admin-dashboard", // key localStorage
    }
  )
);
