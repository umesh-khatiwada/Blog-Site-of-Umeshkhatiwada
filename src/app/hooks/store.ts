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



interface useMetaData {
    blogId: number;
    title: string;
    description: string;
    setCategoryId: (id: number) => void;
    setMetaData: (payload: { title: string; description: string }) => void;
  }
  
  // export const useMetaData = create<useMetaData>((set) => ({
  //   blogId: 0, 
  //   title: "Umesh Khatiwada",
  //   description: "Explore Umesh Khatiwada's expertise in cloud infrastructure, automation, and software development. DevOps Professional & Cloud Architect offering services and insights.",
  //   setCategoryId: (id) => set({ blogId: id }),
  //   setMetaData: (payload) => set({ title: payload.title, description: payload.description }),
  // }));
  
  
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

// interface Metadata {
//   title: string;
//   description: string;
// }
// interface MetadataState extends Metadata {
//   setMetadata: (metadata: Partial<Metadata>) => void;
// }

// export const useMetadataStore = create<MetadataState>((set) => ({
//   title: 'Umesh Khatiwada - DevOps Professional & Cloud Architect',
//   description: "Explore Umesh Khatiwada's expertise in cloud infrastructure, automation, and software development. DevOps Professional & Cloud Architect offering services and insights.",
//   setMetadata: (metadata) => set((state) => ({ ...state, ...metadata })),
// }));