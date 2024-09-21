import { create } from 'zustand';

// Define the shape of your store's state
interface CategoryState {
    categoryId: number; // Current category ID
    setCategoryId: (id: number) => void; // Function to set the category ID
}

// Create the Zustand store with the defined state type
export const useCategory = create<CategoryState>((set) => ({
    categoryId: 0, 
    setCategoryId: (id) => set({ categoryId: id }), // Function to set the category ID
}));



interface MetaData {
    blogId: number;
    title: string;
    description: string;
    setCategoryId: (id: number) => void;
    setMetaData: (payload: { title: string; description: string }) => void;
  }
  
  export const useMetaData = create<MetaData>((set) => ({
    blogId: 0, 
    title: "",
    description: "",
    setCategoryId: (id) => set({ blogId: id }),
    setMetaData: (payload) => set({ title: payload.title, description: payload.description }),
  }));
  