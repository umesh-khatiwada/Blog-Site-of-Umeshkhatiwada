import { create } from 'zustand';

// Define the shape of your store's state
interface CategoryState {
    categoryId: number;
    setCategoryId: (id: number) => void; 
}

// Create the Zustand store with the defined state type
export const useCategory = create<CategoryState>((set) => ({
    categoryId: 0, 
    setCategoryId: (id) => set({ categoryId: id }),
}));
interface useMetaData {
    blogId: number;
    title: string;
    description: string;
    setCategoryId: (id: number) => void;
    setMetaData: (payload: { title: string; description: string }) => void;
  }
  
  export const useMetaData = create<useMetaData>((set) => ({
    blogId: 0,
    title: "Initial Title",
    description: "Initial Description",
    setCategoryId: (id) => set({ blogId: id }),
    setMetaData: (payload) => {
      console.log("setMetaData called with:", payload); // Debugging state update
      set({ title: payload.title, description: payload.description });
    },
  }));