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
