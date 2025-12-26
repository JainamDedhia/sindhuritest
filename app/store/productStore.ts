import { create } from "zustand";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

type Store = {
  products: Product[];
  addProduct: (product: Product) => void;
};

export const useProductStore = create<Store>((set) => ({
  products: [],
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
}));
