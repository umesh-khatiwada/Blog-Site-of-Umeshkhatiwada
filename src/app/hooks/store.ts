import { create } from 'zustand';

export const useStore = create((set) => ({
  count: 0,
  increaseCount: () => set((state: { count: number; }) => ({ count: state.count + 1 })),
  decreaseCount: () => set((state: { count: number; }) => ({ count: state.count - 1 })),
}));

export const useSideBar = create((set: any) => ({
  isOpen: false,
  toggleSidebar: () => set((state: { isOpen: boolean; }) => ({ isOpen: !state.isOpen })),
}))