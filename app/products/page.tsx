"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";


interface ApiProduct{
  id: number;
  name: string;
  description: string;
  price: string;
  is_sold_out:boolean;
  category_name:string;
  image_url:string;
}

/* TEMP MOCK DATA */
const mockProducts = Array.from({ length: 8 }, (_, i) => ({
  id: i.toString(),
}));

export default function ProductsPage() {
  
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try{
        const res = await fetch('/api/products');
        if(!res.ok) throw new Error("Failed to Fetch");
        const data = await res.json();
        setProducts(data);
      }catch(error){
        console.log("Error Loading products: ", error);
      }finally{
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
    <input type="text" placeholder="Search Products" className="mt-5 bg-white "></input>
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Our Collection</h1>

      <section className="py-2">
        {/* CHANGES HERE:
           1. grid-cols-2 (Mobile default)
           2. gap-3 (Smaller gap for mobile)
           3. sm:gap-6 (Larger gap for desktop)
        */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((item) => (
                <ProductCard
                  key={item.id}
                  product={{
                    id: item.id,
                    title: item.name,
                    category: item.category_name || "Jewelry",
                    description: item.description,
                    price: Number(item.price),
                    image: item.image_url || "https://placehold.co/400x500",
                    inStock: !item.is_sold_out,
                  }}
                />
              ))}
        </div>
      </section>
    </div>
  </>
  );
}