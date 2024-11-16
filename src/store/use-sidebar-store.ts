import { create } from 'zustand';

type State = {
  isCollapsed: boolean;
}

type Actions = {
  toggleCollapse: () => void;
}

type SidebarStore = State & Actions;

export const useSidebarStore = create<SidebarStore>()((set) => ({
  isCollapsed: false,
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
})); 