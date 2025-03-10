import { create } from 'zustand';

// Define the shape of your store's state
// interface CategoryState {
//     categoryId: number;
//     setCategoryId: (id: number) => void; 
// }

// Create the Zustand store with the defined state type
// export const useCategory = create<CategoryState>((set) => ({
//     categoryId: 0, 
//     setCategoryId: (id) => set({ categoryId: id }),
// }));
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
      set({ title: payload.title, description: payload.description });
    },
  }));




  interface CategoryStore {
    categoryId: string;
    setCategoryId: (id: string) => void;
  }
  
  export const useCategory = create<CategoryStore>((set, get) => ({
    categoryId: 'null',
    setCategoryId: (id) => {
      console.log(`Setting categoryId to: ${id}`);
      set({ categoryId: id });
      // Check the updated state
      console.log(`Updated categoryId state: ${get().categoryId}`);
    },
  }));