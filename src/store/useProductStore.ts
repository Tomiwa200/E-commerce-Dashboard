import { create } from "zustand";

interface ProductFilterState {
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductFilterState>((set) => ({
  searchQuery: "",
  selectedCategory: "All",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  resetFilters: () => set({ searchQuery: "", selectedCategory: "All" }),
}));
