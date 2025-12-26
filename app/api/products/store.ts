export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  productCode: string;
};

export const products: Product[] = [];

// TEMP category store
export const categories: string[] = [
  "Rings",
  "Necklaces",
  "Bracelets",
];
